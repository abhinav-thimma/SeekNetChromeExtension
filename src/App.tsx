import React, { useState } from 'react';
import Home from './components/Home';
import './App.css';

function App() {

  const [currentUrl, setCurrentUrl] = useState('');
  chrome.tabs.query({ active: true, currentWindow: true },
    (tabs) => {
      setCurrentUrl(tabs[0].url ? tabs[0].url : '');
  });

  return (
    <div className="App">
      <Home url={currentUrl}/>
    </div>
  );
}

export default App;
