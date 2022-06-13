import jwt from 'jsonwebtoken';
import mg from 'mailgun-js';

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
};
export const mailgun = () =>
  mg({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  });

export const payOrderEmailTemplate = (order) => {
  return `<h1>Merci d'avoir acheté chez nous</h1>
  <p>
  Salut Monsieur :<strong> ${order.user.name}</strong>,</p>
  <p>Nous avons terminé le traitement de votre commande.</p>
  <h2>[Commande ${order._id}] (${order.createdAt
    .toString()
    .substring(0, 10)})</h2>
  <table>
  <thead>
  <tr>
  <td><strong>Produit</strong></td>
  <td><strong>Quantité</strong></td>
  <td align="right"><strong >Prix</strong></td>
  </thead>
  <tbody>
  ${order.orderItems
    .map(
      (item) => `
    <tr>
    <td>${item.name}</td>
    <td align="center">${item.quantity}</td>
    <td align="right"> ${item.price} DA </td>
    </tr>
  `
    )
    .join('\n')}
  </tbody>
  <tfoot>
  <tr>
  <td colspan="2">Prix des articles:</td>
  <td align="right"> ${order.itemsPrice} DA </td>
  </tr>
  <tr>
  <td colspan="2">Prix de livraison:</td>
  <td align="right"> ${order.shippingPrice} DA </td>
  </tr>
  <tr>
  <td colspan="2"><strong>Prix Total:</strong></td>
  <td align="right"><strong> ${order.totalPrice} DA </strong></td>
  </tr>
  <tr>
  <td colspan="2">Méthode de paiement:</td>
  <td align="right">${order.paymentMethod}</td>
  </tr>
  </table>
  <h2>Adress de livraison </h2>
  <p>
  ${order.shippingAddress.fullName}<br/>
  ${order.shippingAddress.address}<br/>
  ${order.shippingAddress.city}<br/>
  ${order.shippingAddress.phone}<br/>
  ${order.shippingAddress.postalCode}<br/>
  </p>
  <hr/>
  <p><strong>
  Remarque : Votre commande mettra de 2 à 6 jours pour arriver à l'adresse de livraison. Vous serez contacté par téléphone dès son arrivée.
  </strong>
  
  </p>

  `;
};
export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid Admin Token' });
  }
};
