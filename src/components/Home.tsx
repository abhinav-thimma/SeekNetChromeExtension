import React, { useState } from 'react';
import '.././App.css';
import ManualConnection from './ManualConnection';
import SearchSeekNet from './SearchSeekNet';
import { goTo } from 'react-chrome-extension-router';
import { Button, Form, Card } from 'react-bootstrap';

function Home(props: any) {
  const [seeknetSearchResults, setSeeknetSearchResults] = useState([]);
  const [query, setQuery] = useState('');

  const handleSubmit = (event: any) => {
    event.preventDefault();

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ query: query, url: props.url })
    };

    fetch('http://127.0.0.1:5000/search', requestOptions)
      .then(response => response.json())
      .then(data => setSeeknetSearchResults(data['results']));
  };

  const handleLinkClick = (e: any) => {
    console.log(e);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ id: e.target.id })
    };

    fetch('http://127.0.0.1:5000/log', requestOptions)
      .then(response => response.json());
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicQuery">
              <Form.Control type="text" placeholder="Enter your query" onChange={(e) => setQuery(e.target.value)} />
            </Form.Group>

            <Button variant="info" type="submit">
              Search
            </Button>
          </Form>
        </div>
        <br />
        <div id="SearchResults" className="SearchResults"> 
          {seeknetSearchResults.length > 0 &&
            <Card>
              <Card.Header>Seeknet results</Card.Header>
              <Card.Body>
                {seeknetSearchResults.map((result: any, index: number) => (
                  <div>
                    <Card.Link href={result.url}  id={result.id} onClick={handleLinkClick}>{result.text}</Card.Link>
                    <br/>
                  </div>
                ))}
              </Card.Body>
            </Card>
          }
        </div>
        <br/>
        <Button variant="info" className="AppButton" onClick={() => goTo(ManualConnection, {url: props.url})}>Manual Connection</Button>
        <br />
        <Button variant="info" className="AppButton" onClick={() => goTo(SearchSeekNet, {url: props.url})}>Search Seeknet</Button>

      </header>
    </div>
  );
}

export default Home;
