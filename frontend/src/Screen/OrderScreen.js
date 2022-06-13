import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import LoadingBox from '../Component/LoadingBox';
import MessageBox from '../Component/MessageBox';
import { Store } from '../Store';
import Button from 'react-bootstrap/Button';
import { getError } from '../util';
import { toast } from 'react-toastify';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'DELIVER_REQUEST':
      return { ...state, loadingDeliver: true };
    case 'DELIVER_SUCCESS':
      return { ...state, loadingDeliver: false, successDeliver: true };
    case 'DELIVER_FAIL':
      return { ...state, loadingDeliver: false };
    case 'PAID_REQUEST':
      return { ...state, loadingPaid: true };
    case 'PAID_SUCCESS':
      return { ...state, loadingPaid: false, successPaid: true };
    case 'PAID_FAIL':
      return { ...state, loadingPaid: false };
    case 'DELIVER_RESET':
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
        loadingPaid: false,
        successPaid: false,
      };
    default:
      return state;
  }
}
export default function OrderScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();

  const [
    {
      loading,
      error,
      order,
      loadingDeliver,
      successDeliver,
      successPaid,
      loadingPaid,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (!userInfo) {
      return navigate('/login');
    }
    if (
      !order._id ||
      successDeliver ||
      successPaid ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();
      if (successDeliver || successPaid) {
        dispatch({ type: 'DELIVER_RESET' });
      }
    }
  }, [
    order,
    userInfo,
    orderId,
    navigate,
    successDeliver,
    successPaid,
    loadingPaid,
  ]);

  async function deliverOrderHandler() {
    try {
      dispatch({ type: 'DELIVER_REQUEST' });
      const { data } = await axios.put(
        `/api/orders/${order._id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'DELIVER_SUCCESS', payload: data });
      toast.success('Commande livré');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'DELIVER_FAIL' });
    }
  }

  async function paidOrderHandler() {
    try {
      dispatch({ type: 'PAID_REQUEST' });
      const { data } = await axios.put(
        `/api/orders/${order._id}/paid`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'PAID_SUCCESS', payload: data });
      toast.success('Commande Payé');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'PAID_FAIL' });
    }
  }

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>Commande {orderId}</title>
      </Helmet>
      <h1 className="my-3">Commande {orderId}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3" style={{ height: '14rem' }}>
            <Card.Body>
              <Card.Title>Livraison</Card.Title>
              <Card.Text>
                <strong>Nom:</strong> {order.shippingAddress.fullName} <br />
                <strong>address: </strong> {order.shippingAddress.address},
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                ,{order.shippingAddress.country}
              </Card.Text>
              {order.isDelivered ? (
                <MessageBox variant="success">
                  Livré à {order.deliveredAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Non livrés</MessageBox>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3" style={{ height: '10rem' }}>
            <Card.Body>
              <Card.Title>Paiement</Card.Title>
              <Card.Text>
                <strong>Méthode:</strong> {order.paymentMethod}
              </Card.Text>
              {order.isPaid ? (
                <MessageBox variant="success">Payé à {order.paidAt}</MessageBox>
              ) : (
                <MessageBox variant="danger">Impayé</MessageBox>
              )}
            </Card.Body>
          </Card>
          <div
            style={{ marginBottom: '4rem' }}
            className="border border rounded"
          >
            <h3 className="ms-2">Produit</h3>
            <ListGroup variant="flush">
              {order.orderItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row md={3} className="align-items-center">
                    <Col md={6}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid rounded img-thumbnail w-25"
                      ></img>{' '}
                      <Link
                        style={{ textDecoration: 'none' }}
                        to={`/product/${item.slug}`}
                        className="titre"
                      >
                        {item.name}
                      </Link>
                    </Col>
                    <Col md={3}>
                      <span>{item.quantity} Pcs</span>
                    </Col>
                    <Col md={3}>{item.price} DA</Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </Col>
        <Col md={4}>
          <Card className="mb-3 h-25 ">
            <Card.Body>
              <Card.Title>Compte rendu Commande</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Produit</Col>
                    <Col>{order.itemsPrice} DA</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Livraison</Col>
                    <Col>{order.shippingPrice} DA</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong> Total </strong>
                    </Col>
                    <Col>
                      <strong>{order.totalPrice}DA</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                {userInfo.isAdmin && !order.isDelivered && (
                  <ListGroup.Item>
                    {loadingDeliver && <LoadingBox></LoadingBox>}
                    <div className="d-grid m">
                      <Button type="button " onClick={deliverOrderHandler}>
                        Livré Commande{}
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
                {userInfo.isAdmin && !order.isPaid && (
                  <ListGroup.Item>
                    {loadingPaid && <LoadingBox></LoadingBox>}
                    <div className="d-grid m ">
                      <Button type="button " onClick={paidOrderHandler}>
                        Payé Commande{}
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
