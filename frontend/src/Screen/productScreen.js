import { useContext, useEffect, useReducer, useRef, useState } from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import Rating from '../Component/Rating';
import LoadingBox from '../Component/LoadingBox';
import MessageBox from '../Component/MessageBox';
import { getError } from '../util';
import { Store } from '../Store';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { toast } from 'react-toastify';
import Form from 'react-bootstrap/Form';

const reducer = (state, action) => {
  switch (action.type) {
    case 'REFRESH_PRODUCT':
      return { ...state, product: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreateReview: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreateReview: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreateReview: false };
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
function ProductScreen() {
  let reviewsRef = useRef();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedImage, setSelectedImage] = useState('');

  const navigate = useNavigate();

  const params = useParams();
  const { slug } = params;
  const [{ loading, error, product, loadingCreateReview }, dispatch] =
    useReducer(reducer, {
      product: [],
      loading: true,
      error: '',
    });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Désolé. Le produit est en rupture de stock');
      return;
    }

    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
    navigate('/cart');
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error('Veuillez entrer un commentaire et une évalution');
      return;
    }
    try {
      const { data } = await axios.post(
        `/api/products/${product._id}/reviews`,
        { rating, comment, name: userInfo.name },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({
        type: 'CREATE_SUCCESS',
      });
      toast.success('Avis envoyé avec succès');
      product.reviews.unshift(data.review);
      product.numReviews = data.numReviews;
      product.rating = data.rating;
      dispatch({ type: 'REFRESH_PRODUCT', payload: product });
      window.scrollTo({
        behavior: 'smooth',
        top: reviewsRef.current.offsetTop,
      });
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: 'CREATE_FAIL' });
    }
  };
  const deleteHandler = async (product) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await axios.delete(`/api/products/${product._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('produit supprimé avec succès');
        dispatch({ type: 'DELETE_SUCCESS' });
        navigate('/');
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Row>
        <Col md={6}>
          <img
            className="img-large w-50"
            src={selectedImage || product.image}
            alt={product.name}
          ></img>
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h3>{product.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                rating={product.rating}
                numReviews={product.numReviews}
              ></Rating>
            </ListGroup.Item>
            <ListGroup.Item>Prix : {product.price}DA</ListGroup.Item>
            <ListGroup.Item>
              <Row xs={1} md={2} className="g-2 ">
                {[product.image, ...product.images].map((x) => (
                  <Col key={x}>
                    <Card className="h-75 mb-4">
                      <Button
                        className="thumbnail"
                        type="button"
                        variant="light"
                        onClick={() => setSelectedImage(x)}
                      >
                        <Card.Img variant="top" src={x} alt="product" />
                      </Button>
                    </Card>
                  </Col>
                ))}
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              Description:
              <p>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card className="ms-3 ">
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Prix:</Col>
                    <Col>{product.price}DA</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg="success">En stock</Badge>
                      ) : (
                        <Badge bg="danger">Indisponible</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button onClick={addToCartHandler} variant="primary">
                        Ajouter Au Panier
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}{' '}
              </ListGroup>
            </Card.Body>
          </Card>
          <Col>
            {' '}
            {userInfo && userInfo.isAdmin && (
              <tr>
                <td>
                  <Button
                    className="btn-primary ms-3 mt-2"
                    type="button"
                    variant="light"
                    onClick={() => navigate(`/admin/product/${product._id}`)}
                  >
                    Modifier
                  </Button>
                </td>
                &nbsp;
                <Button
                  className="btndanger bg-danger mt-2"
                  type="button"
                  variant="light"
                  onClick={() => deleteHandler(product)}
                >
                  Supprimer
                </Button>
              </tr>
            )}{' '}
          </Col>
        </Col>{' '}
      </Row>
      <div className="my-3">
        <h2 ref={reviewsRef}>Les Avis</h2>
        <div className="mb-3">
          {product.reviews.length === 0 && (
            <MessageBox>Il n'y a pas d'avis</MessageBox>
          )}
        </div>
        <ListGroup>
          {product.reviews.map((review) => (
            <ListGroup.Item key={review._id}>
              <strong>{review.name}</strong>
              <Rating rating={review.rating} caption=" "></Rating>
              <p>{review.createdAt.substring(0, 10)}</p>
              <p>{review.comment}</p>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <div className="my-3">
          {userInfo ? (
            <form onSubmit={submitHandler}>
              <h2>Donnez-nous votre avis</h2>
              <Form.Group className="mb-3" controlId="rating">
                <Form.Label>Évaluation</Form.Label>
                <Form.Select
                  aria-label="Rating"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value="">Sélectionner...</option>
                  <option value="1">1- Faible</option>
                  <option value="2">2- Moyen</option>
                  <option value="3">3- Bien</option>
                  <option value="4">4- Très Bien</option>
                  <option value="5">5- Excellent</option>
                </Form.Select>
              </Form.Group>
              <FloatingLabel
                controlId="floatingTextarea"
                label="Commentaire"
                className="mb-3"
              >
                <Form.Control
                  as="textarea"
                  placeholder="Laissez Un Commentaire ici"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </FloatingLabel>

              <div className="mb-3">
                <Button disabled={loadingCreateReview} type="submit">
                  Envoyer
                </Button>
                {loadingCreateReview && <LoadingBox></LoadingBox>}
              </div>
            </form>
          ) : (
            <MessageBox>
              S'il te plaît{' '}
              <Link to={`/signin?redirect=/product/${product.slug}`}>
                Se Connceter{' '}
              </Link>{' '}
              Pour écrire un Commentaire
            </MessageBox>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductScreen;
