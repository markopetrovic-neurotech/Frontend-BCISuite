import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import icon from '../assets/icon.svg';
import './App.global.css';
//import { w3cwebsocket as W3CWebSocket } from 'websocket';



function Hello(){
  let client = new WebSocket('ws://localhost:8080/ws')
//
//const client = new W3CWebSocket('ws://127.0.0.1:8080/ws');
  useEffect(() => {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
      client.send("MESSAGE")
    };
    client.onerror= (message) => {
      console.log(message);
    };
    client.onmessage = (message) => {
      console.log(message);
    };
    client.onclose = () => {
      console.log("closed")
    }

  }, [client])
  return (
    <div>
      <div className="Hello">
        <img width="200px" alt="icon" src={icon} />
      </div>
      <h1>electron-react-boilerplate</h1>
      <div className="Hello">

          <button onClick={()=>{
            client.send("TEST MESSAGE")
          }} type="button">
            <span role="img" aria-label="books">
              📚
            </span>
            Read our docs
          </button>
    
        <a
          href="https://github.com/sponsors/electron-react-boilerplate"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="books">
              🙏
            </span>
            Donate
          </button>
        </a>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Hello} />
      </Switch>
    </Router>
  );
}
