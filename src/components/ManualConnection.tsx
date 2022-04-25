import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { goTo } from 'react-chrome-extension-router';
import Home from './Home';
import '.././App.css';

function ManualConnection(props: any) {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [ message, setMessage ] = useState('');

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ text: text, src_url: props.url, tgt_url: url })
    };
    
    fetch('http://127.0.0.1:5000/connect', requestOptions)
      .then(response => response.json())
      .then(data => setMessage('Successfully connected'));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h3>Manual connection</h3>
        <div>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicText">
              <Form.Control type="text" placeholder="Enter your query" onChange={(e) => setText(e.target.value)} />
              <br/>
              <Form.Control type="url" placeholder="Enter URL to connect" onChange={(e) => setUrl(e.target.value)} />
            </Form.Group>

            <Form.Label>
              {message}
            </Form.Label>
            <br/>

            <Button variant="info" className="AppButton" type="submit" disabled={message.length > 0}>
              Connect
            </Button>
          </Form>
        </div>
        <br/>
        <Button variant="info" className="AppButton" onClick={() => goTo(Home)}>Back</Button>
      </header>
    </div>
  );
}

export default ManualConnection;
