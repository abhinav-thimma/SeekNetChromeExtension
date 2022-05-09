import React, { useState } from 'react';
import { Button, Form, Card } from 'react-bootstrap';
import { goTo } from 'react-chrome-extension-router';
import Home from './Home';
import '.././App.css';


function SearchSeekNet(props: any) {
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

  return (
    <div className="App">
      <header className="App-header">
        <h3>Search Seeknet</h3>
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
                    <Card.Link href={result.url} target="_blank" id={result.id}>{result.text}</Card.Link>
                    <br/>
                  </div>
                ))}
              </Card.Body>
            </Card>
          }
        </div>
        <br/>
        <Button variant="info" onClick={() => goTo(Home)}>Back</Button>
      </header>
    </div>
  );
}

export default SearchSeekNet;
