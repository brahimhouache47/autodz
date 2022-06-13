import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function CheckoutSteps(props) {
  return (
    <Row className="checkout-steps">
      <Col className={props.step1 ? 'active' : ''}>Se Connecter</Col>
      <Col className={props.step2 ? 'active' : ''}>
        Informations de livraison
      </Col>
      <Col className={props.step3 ? 'active' : ''}>Paiement</Col>
      <Col className={props.step4 ? 'active' : ''}>Passer la commande</Col>
    </Row>
  );
}
