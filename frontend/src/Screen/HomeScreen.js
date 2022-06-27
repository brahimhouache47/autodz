import { useState, useEffect, useReducer } from 'react';
import axios from 'axios';
import logger from 'use-reducer-logger';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../Component/Product';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../Component/LoadingBox';
import MessageBox from '../Component/MessageBox';
import socketIOClient from 'socket.io-client';

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
  /** */
  const [socket, setSocket] = useState(null);

  const ENDPOINT =
    window.location.host.indexOf('localhost') >= 0
      ? 'http://127.0.0.1:5000'
      : window.location.host;
  /** */
  if (!socket) {
    const sk = socketIOClient(ENDPOINT);
    setSocket(sk);
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

    /** */

    sk.on('commande', (data) => {
      Notification.requestPermission().then((result) => {
        if (result === 'granted') {
          const notifTitle = 'Vous Avés un Noveau Commande';
          const notifImg = '../logo.svg';
          const options = {
            icon: notifImg,
          };
          new Notification(notifTitle, options);
        }
      });
    });
  }

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

  return (
    <div>
      <Helmet>
        <title>AutoPartDZ</title>
      </Helmet>

      <h1>Notre Produits</h1>
      <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {products.length === 0 && (
              <MessageBox>Aucun Produit Trouvee</MessageBox>
            )}
            {products.map((product) => (
              <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
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
