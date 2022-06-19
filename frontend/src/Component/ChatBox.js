import React, { useEffect, useRef, useState } from 'react';
import socketIOClient from 'socket.io-client';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import message from '../message.png';

const ENDPOINT =
  window.location.host.indexOf('localhost') >= 0
    ? 'http://127.0.0.1:5000'
    : window.location.host;

export default function ChatBox(props) {
  const { userInfo } = props;
  const [socket, setSocket] = useState(null);
  const uiMessagesRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [messageBody, setMessageBody] = useState('');
  const [messages, setMessages] = useState([
    { name: 'AutoPartDZ', body: 'Bonjour, veuillez poser votre question.' },
  ]);

  useEffect(() => {
    if (uiMessagesRef.current) {
      uiMessagesRef.current.scrollBy({
        top: uiMessagesRef.current.clientHeight,
        left: 0,
        behavior: 'smooth',
      });
    }
    if (socket) {
      socket.emit('onLogin', {
        _id: userInfo._id,
        name: userInfo.name,
        isAdmin: userInfo.isAdmin,
      });
      socket.on('message', (data) => {
        setMessages([...messages, { body: data.body, name: data.name }]);
      });
    }
  }, [messages, isOpen, socket, userInfo]);

  const supportHandler = () => {
    setIsOpen(true);
    console.log(ENDPOINT);
    const sk = socketIOClient(ENDPOINT);
    setSocket(sk);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    if (!messageBody.trim()) {
      alert('Erreur. Veuillez saisir un message.');
    } else {
      setMessages([...messages, { body: messageBody, name: userInfo.name }]);
      setMessageBody('');
      setTimeout(() => {
        socket.emit('onMessage', {
          body: messageBody,
          name: userInfo.name,
          isAdmin: userInfo.isAdmin,
          _id: userInfo._id,
        });
      }, 1000);
    }
  };
  const closeHandler = () => {
    setIsOpen(false);
  };
  return (
    <div className="chatbox ">
      {!isOpen ? (
        <img
          className="img-chat "
          src={message}
          alt=""
          onClick={supportHandler}
        ></img>
      ) : (
        <Card className="scroll">
          <Card.Body>
            <Row className="justify-content-between align-items-center">
              <Col>
                <strong>Service Client </strong>
              </Col>
              <Col className="text-end">
                <Button variant="light" type="button" onClick={closeHandler}>
                  <i class="fas fa-times-circle"></i>
                </Button>
              </Col>
            </Row>
            <ul ref={uiMessagesRef}>
              {messages.map((msg, index) => (
                <li key={index}>
                  <strong>{`${msg.name}: `}</strong> {msg.body}
                </li>
              ))}
            </ul>
            <div>
              <form onSubmit={submitHandler}>
                <InputGroup>
                  <FormControl
                    type="text"
                    id="q"
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                    required
                  />
                </InputGroup>
                <Button
                  className="mt-2"
                  variant="outline-primary"
                  type="submit"
                  id="button-search"
                >
                  Envoyer
                </Button>
              </form>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}
