import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.main`
  width: 500px;
  height: 500px;
  border-left: 2px solid black;
  border-top: 2px solid black;
  border-bottom: 2px solid black;

  overflow-y: auto;
  overflow-x: hidden;

  .msg-container {
    display: flex;
    flex-direction: column;
    border-radius: 6px;
    background-color: #e5e6ff;
    margin: 12px;

    p {
      padding: 6px 12px 12px 12px;
      font-weight: 600;
    }

    p:first-child {
      padding-top: 12px;
      padding-bottom: 0px;
      color: #9da0de;
      font-size: 12px;
    }
  }
`;

export default function MainMain({ socket, room, clientMessage }) {
  const [mess, setMess] = useState([]);

  useEffect(() => {
    if (socket && room) {
      socket.on('new_message', msg => {
        let message = [...mess];
        message.push(msg);
        
        setMess(message);
      });
    }

    return () => {
      if (socket) {
        socket.off('new_message');
      }
    }
  }, [socket, mess, room]);

  useEffect(() => {
    if (clientMessage.message) {
      const messages = [...mess];
      messages.push(clientMessage);
      setMess(messages);
    }
  }, [clientMessage]);

  useEffect(() => {
    if (room) {
      axios.get('/chatroom/' + room)
        .then(data => data.data)
        .then(mess => setMess(mess))
        .catch(err => {
          console.log(err);
        });
    };
  }, [room]);

  return (
    <Container>
      {mess.map(msg => {
        return (
          <div key={msg._id} className="msg-container">
            <p>{msg.user}</p>
            <p>{msg.message}</p>
          </div>
        )
      })}
    </Container>
  )
}