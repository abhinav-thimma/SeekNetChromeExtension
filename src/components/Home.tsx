import React, { useState, useEffect } from 'react';
import '.././App.css';
import ManualConnection from './ManualConnection';
import { goTo } from 'react-chrome-extension-router';
import { Button, Form, Card } from 'react-bootstrap';

function Home(props: any) {
  const [seeknetSearchResults, setSeeknetSearchResults] = useState([]);
  const [urlSearchResults, setUrlSearchResults] = useState([]);
  const [ddgSearchResults, setDDGSearchResults] = useState([]);
  const [query, setQuery] = useState('');
  const currentUrl = props.url;

  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    };

    fetch('http://127.0.0.1:5000/?url=' + currentUrl, requestOptions)
      .then(response => response.json())
      .then(data => setUrlSearchResults(data['payload']['connections']));
      console.log(currentUrl);
  }, [setUrlSearchResults, currentUrl]);

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

      const requestDDGOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      };
  
      fetch('http://127.0.0.1:5000/ddg?query='+ query, requestDDGOptions)
        .then(response => response.json())
        .then(data => setDDGSearchResults(data['results']));

  };


  const handleLinkClick = async(e: any) => {
    console.log('Clicked: ', e);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ src_url: currentUrl, tgt_url: e.target.href, search_text: query})
    };

    await fetch('http://127.0.0.1:5000/log_clicks', requestOptions)
      .then(response => response.json())
      .then(data => console.log(data));
    
    window.open(e.target.href);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h3 style={{color:"white", fontStyle: "italic"}}>SeekNet</h3>
        <br />
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
              <Card.Header style={{color:"black", fontWeight: "bold"}}>Seeknet Results</Card.Header>
              <Card.Body>
                {seeknetSearchResults.map((result: any, index: number) => (
                  <div>
                    <Card.Link href={result.url}  id={result.id} onClick={handleLinkClick}>{result.text}</Card.Link>
                    <br />
                  </div>
                ))}
              </Card.Body>
            </Card>
          }
        </div>
        <br />
        <div id="SearchResults" className="SearchResults">
          {ddgSearchResults.length > 0 &&
            <Card>
              <Card.Header style={{color:"black", fontWeight: "bold"}}>DuckDuckGo Results</Card.Header>
              <Card.Body>
                {ddgSearchResults.map((result: any, index: number) => (
                  <div>
                    <Card.Link href={result.url} onClick={handleLinkClick}>{result.title}</Card.Link>
                    <br />
                  </div>
                ))}
              </Card.Body>
            </Card>
          }
        </div>
        <br />
        <Button variant="info" className="AppButton" onClick={() => goTo(ManualConnection, { url: props.url })}>Manual Connection</Button>
        <br />
        {/* <Button variant="info" className="AppButton" onClick={() => goTo(SearchSeekNet, {url: props.url})}>Search Seeknet</Button> */}
        <div id="urlConnections" className="urlConnections">
          {urlSearchResults.length > 0 &&
            <Card>
              <Card.Header style={{color:"black", fontWeight: "bold"}}>Connection with current URL as source</Card.Header>
              <Card.Body>
                {urlSearchResults.map((result: any, index: number) => (
                  <div>
                    <Card.Link href={result.tgt_url} id={result.id} onClick={handleLinkClick}>{result.text}</Card.Link>
                    <br />
                  </div>
                ))}
              </Card.Body>
            </Card>
          }
        </div>
      </header>
    </div>
  );
}

export default Home;
