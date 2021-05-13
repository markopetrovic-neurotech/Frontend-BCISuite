/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/order */
import React, { useEffect, Suspense, useState, useRef } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import BrainCanvas from './Canvas/BrainCanvas';
import { Frame } from 'stompjs';
import { SockJsProvider } from 'use-sockjs';
import EEGgraph from './Graphs/EEG_Graph';
import Header from './Header';
import './App.global.css';

export default function App() {
  return (
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
  );
}
