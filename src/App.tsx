/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/order */
import React, {  } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import BrainCanvas from './Canvas/BrainCanvas';
import { Frame } from 'stompjs';
import { Provider } from 'react-redux'
import { SockJsProvider } from 'use-sockjs';
import store from './Store/store'
import EEGgraph from './Graphs/EEG_Graph';
import Header from './Header';
import './App.global.css';

export default function App() {
  return (
    <Provider store={store}>
      <SockJsProvider
        onError={(error: Frame | string) => {
          console.log(error);
        }}
      >
        <Router>
          <Header />
          <Switch>
            <Route path="/" exact component={EEGgraph} />
            <Route path="/brain" exact component={BrainCanvas} />
          </Switch>
        </Router>
        {/* TODO: Not currently doing anything with this provider */}
      </SockJsProvider>
    </Provider>
  );
}
