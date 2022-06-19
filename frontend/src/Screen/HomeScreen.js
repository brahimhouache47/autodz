import { useState, useEffect, useReducer, useContext, useRef } from 'react';
import axios from 'axios';
import logger from 'use-reducer-logger';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../Component/Product';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../Component/LoadingBox';
import MessageBox from '../Component/MessageBox';
import { toast } from 'react-toastify';
import { getError } from '../util';
import socketIOClient from 'socket.io-client';
import { Store } from '../Store';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
function HomeScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
    products: [],
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, [categories]);
  /** */
  const [selectedUser, setSelectedUser] = useState({});
  const [socket, setSocket] = useState(null);
  const uiMessagesRef = useRef(null);
  const [messageBody, setMessageBody] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  const { state } = useContext(Store);
  const { userInfo } = state;
  const ENDPOINT =
    window.location.host.indexOf('localhost') >= 0
      ? 'http://127.0.0.1:5000'
      : window.location.host;

  if (!socket) {
    const sk = socketIOClient(ENDPOINT);
    setSocket(sk);
    sk.emit('onLogin', {
      _id: userInfo._id,
      name: userInfo.name,
      isAdmin: userInfo.isAdmin,
    });
    sk.on('message', (data) => {
      Notification.requestPermission().then((result) => {
        if (result === 'granted') {
          const notifTitle = data.name;
          const notifBody = data.body;
          const notifImg = '../co.jpg';
          const options = {
            body: notifBody,
            icon: notifImg,
          };
          new Notification(notifTitle, options);
        }
      });
    });
  }

  /** */

  return (
    <div>
      <Helmet>
        <title>AutoPartDZ</title>
      </Helmet>

      <h1>Les Noveaux Produit</h1>
      <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row md={3}>
            {products.map((product) => (
              <Col key={product.slug} sm={6} md={6} lg={3}>
                <Product product={product}></Product>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}
export default HomeScreen;
