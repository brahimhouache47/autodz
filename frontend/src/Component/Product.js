import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../Store';

function Product(props) {
  const { product } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Désolé. Le produit est en rupture de stock');

      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };
  return (
    <Card className=" h-100 card-body d-flex flex-column">
      <Link style={{ textDecoration: 'none' }} to={`/product/${product.slug}`}>
        <img
          src={product.image}
          className="  card-img-top  "
          alt={product.name}
        />
      </Link>
      <Card.Body>
        <Link
          style={{ textDecoration: 'none' }}
          to={`/product/${product.slug}`}
        >
          <Card.Title className=" text-dark card-title pricing-card-title">
            {product.name}
          </Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text className="price mt-2 text-center  ">
          {product.price}DA
        </Card.Text>
        {product.countInStock === 0 ? (
          <Button
            variant="light"
            disabled
            className=" btn bg-danger col-md-12 text-center deux  "
          >
            Rupture de stock
          </Button>
        ) : (
          <Button
            onClick={() => addToCartHandler(product)}
            className="ctext-center  btn  col-md-12 text-center   "
          >
            Ajouter Au Panier
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}
export default Product;
