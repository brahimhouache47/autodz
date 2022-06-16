import React, { useContext, useEffect, useReducer } from 'react';
import Chart from 'react-google-charts';
import Axios from 'axios';
import { Store } from '../Store';
import { getError } from '../util';
import LoadingBox from '../Component/LoadingBox';
import MessageBox from '../Component/MessageBox';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import man from '../users.png';
import com from '../orders.png';
import money from '../money.png';
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        summary: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default function DashboardScreen() {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await Axios.get('/api/orders/summary', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [dispatch, userInfo]);

  return (
    <div>
      <h1>Bienvenu {userInfo.name}</h1>

      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <Row>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Link
                    style={{ textDecoration: 'none', color: 'black' }}
                    to="/admin/users"
                  >
                    <img
                      src={man}
                      alt=""
                      className="rounded mx-auto d-block h-75 w-50"
                    />
                  </Link>
                  <Card.Title className="text-center display-6">
                    {summary.users[0].numUsers}
                    <br></br>
                  </Card.Title>

                  <Card.Text className="text-center display-7">
                    {' '}
                    Utilisateurs
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card>
                <Card.Body>
                  <Link
                    style={{ textDecoration: 'none', color: 'black' }}
                    to="/admin/orders"
                  >
                    <img
                      src={com}
                      alt=""
                      className="rounded mx-auto d-block h-75 w-50"
                    />
                  </Link>

                  <Card.Title className="text-center display-6">
                    {summary.orders && summary.orders[0]
                      ? summary.orders[0].numOrders
                      : 0}
                  </Card.Title>
                  <Card.Text className="text-center display-7">
                    Commandes
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card>
                <Card.Body>
                  <img
                    src={money}
                    alt=""
                    className="rounded mx-auto d-block h-50 w-50"
                  />

                  <Card.Title className="mt-4 text-center display-6">
                    {summary.orders && summary.orders[0]
                      ? summary.orders[0].totalSales.toFixed(2)
                      : 0}{' '}
                    DA
                  </Card.Title>
                  <Card.Text className="text-center display-7">
                    Total Commandes
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <div className="my-3">
            <h2>Ventes</h2>
            {summary.dailyOrders.length === 0 ? (
              <MessageBox>Pas de vente</MessageBox>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="LineChart"
                loader={<div>Chargement De Tableau...</div>}
                data={[
                  ['Date', 'Ventes'],
                  ...summary.dailyOrders.map((x) => [x._id, x.sales]),
                ]}
              ></Chart>
            )}
          </div>
          <div className="my-3">
            <h2>Categories</h2>
            {summary.productCategories.length === 0 ? (
              <MessageBox>Aucune catégorie</MessageBox>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="PieChart"
                loader={<div>Chargement De Tableau...</div>}
                data={[
                  ['Category', 'Products'],
                  ...summary.productCategories.map((x) => [x._id, x.count]),
                ]}
              ></Chart>
            )}
          </div>
        </>
      )}
    </div>
  );
}
