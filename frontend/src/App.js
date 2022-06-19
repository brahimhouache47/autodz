import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './Component/Footer';
import HomeScreen from './Screen/HomeScreen';
import ProductScreen from './Screen/productScreen';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import CartScreen from './Screen/CartScreen';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { Store } from './Store';
import SigninScreen from './Screen/Signin';
import ShippingAddressScreen from './Screen/shippingScreen';
import SignupScreen from './Screen/SignUp';
import PaymentMethodScreen from './Screen/PaymentMethodeScreen';
import PlaceOrderScreen from './Screen/PlaceOrderScreen';
import OrderScreen from './Screen/OrderScreen';
import OrderHistoryScreen from './Screen/OrderHistoryScreen';
import ProfileScreen from './Screen/ProfileScreen';
import Button from 'react-bootstrap/Button';
import { getError } from './util';
import axios from 'axios';
import SearchBox from './Component/SearchBox';
import SearchScreen from './Screen/SearchScreen';
import ProtectedRoute from './Component/protectedRoutes';
import DashboardScreen from './Screen/DashBoardScreen';
import AdminRoute from './Component/AdminRoutes';
import ProductListScreen from './Screen/ProductListScreen';
import ProductEditScreen from './Screen/ProductEditScreen';
import OrderListScreen from './Screen/OrderListScreen';
import UserListScreen from './Screen/ListUserScreen';
import UserEditScreen from './Screen/UserEditScreen';
import logo from './logo.PNG';
import SupportScreen from './Screen/SupportScreen';
import ChatBox from './Component/ChatBox';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
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
  }, []);
  return (
    <BrowserRouter>
      <div
        className={
          sidebarIsOpen
            ? 'd-flex flex-column site-container active-cont'
            : 'd-flex flex-column site-container'
        }
      >
        <ToastContainer position="bottom-center" limit={1} />

        <header>
          <Navbar bg="secondary" variant="dark" expand="lg">
            <Container>
              <Button
                variant="secondary"
                className="sid"
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              >
                <i className=" fas fa-bars "></i>
              </Button>

              <LinkContainer to="/">
                <Navbar.Brand>
                  <img className="logo" src={logo} alt="My logo" />
                </Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <SearchBox />

                <Nav className="me-auto  w-100  justify-content-end">
                  <Link
                    style={{ textDecoration: 'none' }}
                    to="/cart"
                    className="nav-link"
                  >
                    Panier
                    {cart.cartItems.length > 0 && (
                      <Badge pill className="bg-warning">
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </Link>
                  {userInfo ? (
                    <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>Profile</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderhistory">
                        <NavDropdown.Item>
                          Historique des commandes
                        </NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link
                        style={{ textDecoration: 'none' }}
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        Se déconnecter
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link
                      style={{ textDecoration: 'none' }}
                      className="nav-link"
                      to="/signin"
                    >
                      Se Connecter
                    </Link>
                  )}{' '}
                  {userInfo && userInfo.isAdmin && (
                    <NavDropdown
                      title="Administrateur"
                      id="admin-nav-dropdown"
                      className="bg-success bg-gradient"
                    >
                      <LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/products">
                        <NavDropdown.Item>Produits</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orders">
                        <NavDropdown.Item>Commandes</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/users">
                        <NavDropdown.Item>Utilisateus</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/supports">
                        <NavDropdown.Item>Support</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>

        <div
          className={
            sidebarIsOpen
              ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
              : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
          }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>Categories</strong>
            </Nav.Item>
            {categories.map((category) => (
              <Nav.Item className="products" key={category}>
                <LinkContainer
                  to={`/search?category=${category}`}
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link className="text-warning">{category}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>
        <main>
          <Container className="mt-4">
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route
                path="/orderhistory"
                element={
                  <ProtectedRoute>
                    <OrderHistoryScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardScreen />
                  </AdminRoute>
                }
              ></Route>

              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <ProductListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route path="/cart" element={<CartScreen />} />
              <Route
                path="/admin/product/:id"
                element={
                  <AdminRoute>
                    <ProductEditScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route path="/signin" element={<SigninScreen />} />
              <Route
                path="/admin/user/:id"
                element={
                  <AdminRoute>
                    <UserEditScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/supports"
                element={
                  <AdminRoute>
                    <SupportScreen />
                  </AdminRoute>
                }
              />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UserListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <OrderListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route path="/" element={<HomeScreen />} />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderScreen />
                  </ProtectedRoute>
                }
              ></Route>
            </Routes>
          </Container>
        </main>

        <footer className="footer">
          {userInfo && !userInfo.isAdmin && <ChatBox userInfo={userInfo} />}
          <Footer />
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
