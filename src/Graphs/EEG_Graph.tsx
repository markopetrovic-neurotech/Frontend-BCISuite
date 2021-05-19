/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/order */
import React, { useEffect, Suspense, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Client, Frame, Message, Subscription } from 'stompjs';
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useSockJs } from 'use-sockjs';
import * as Stomp from 'stompjs';
import getChannelData from '../Actions/GetChannelData';

export default function EEGGraph() {
  const client = new WebSocket('ws://localhost:8080/socket');
  /*
  TODO: Use SockJS with StompJS to connect, subscribe and send messages to a Spring STOMP WebSocket Broker


  const { client, connect, disconnect, subscribe, unsubscribe } = useSockJs();

  const subscriptionRef = useRef<Subscription | null>(null);
  let stompClient: any;
  // connect websocket when init
  useEffect(() => {
    connect({
      url: 'http://localhost:8080/chat',
    });


  }, []);

  // subscribe topic when client connected
  useEffect(() => {
    if (!client || !client.connected) {
      return;
    }
   client.onheartbeat = function () {
      console.log('heartbeat');
    };

    stompClient = Stomp.over(client);

    stompClient.connect({ login: 'Marko' }, function () {});

    stompClient.subscribe('room1', (message: any) => {
      console.log(message);
    });

    /* subscribe({
      destination: '1',
      onMessage: (message) => {
        console.log(message);
      },
      onSubscribed: (subscription) => {
        subscriptionRef.current = subscription;
      },
    });

    // eslint-disable-next-line consistent-return
    return () => {
      if (subscriptionRef.current) {
        unsubscribe(subscriptionRef.current);
      }
      disconnect();
    };
  }, [client, client && client.connected]); */
  const [data, setData]: any[] = useState([]);

  const dispatch = useDispatch()

  useEffect(() => {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
      client.send('MESSAGE');
    };

    client.onerror = (message) => {
      console.log(message);
    };
    client.onmessage = (message: any) => {
      const eegData: any = JSON.parse(message.data);
      // console.log(eegData[0][0]);
      dispatch(getChannelData(eegData))
      /*setData((currentData: any) => {
        return [...currentData, { channel1: eegData[0][0] }];
      });*/
    };
    client.onclose = () => {
      console.log('closed');
    };
  }, []);

  return (
    <LineChart
      width={800}
      height={400}
      data={data}
      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
    >
      <XAxis
        dataKey="time"
        // tickFormatter={(timeStr) => moment(timeStr).format('HH:mm')}
      />
      <YAxis>
        <Label
          value="micro Volts"
          position="left"
          angle={-90}
          style={{ textAnchor: 'middle' }}
        />
      </YAxis>
      {/* <Tooltip />
       <CartesianGrid stroke="#f5f5f5" /> */}
      <Line
        activeDot
        type="monotone"
        dataKey="channel1"
        stroke="#ff7300"
        yAxisId={0}
      />
      {/* <Line type="monotone" dataKey="pv" stroke="#387908" yAxisId={1} /> */}
    </LineChart>
  );
}
