/* eslint-disable import/order */
import React, { useEffect, Suspense, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Canvas } from 'react-three-fiber';
import Brain from './Canvas/Spineless';
import icon from '../assets/icon.svg';
import {
  Html,
  PerspectiveCamera,
  OrbitControls,
  OrthographicCamera,
  FlyControls,
} from '@react-three/drei';
import './App.global.css';

const client = new WebSocket('ws://localhost:8080/socket');

export default function App() {
  useEffect(() => {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
      client.send('MESSAGE');
    };
    client.onerror = (message) => {
      console.log(message);
    };
    client.onmessage = (message) => {
      console.log(message);
    };
    client.onclose = () => {
      console.log('closed');
    };
  }, []);
  const [response, setResponse] = useState('');

  return (
    <Canvas camera={{ position: [0, 0, 10] }}>
      <OrbitControls autoRotate/>
      <Suspense fallback={null}>
        <Brain />
      </Suspense>
    </Canvas>
  );
}
