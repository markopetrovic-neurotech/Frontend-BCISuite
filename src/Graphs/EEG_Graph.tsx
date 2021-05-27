/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/order */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as d3 from "d3";
import getChannelData from '../Actions/GetChannelData';

const client = new WebSocket('ws://localhost:8080/socket');

export default function EEGGraph() {
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

  interface dataType { time: number, value: number }
  const dispatch = useDispatch()
  const currentData = useSelector((state : any) => state.allChannelsReducer.currentData)
  const [shiftingData, setShiftingData] = useState<dataType[]>([])

  useEffect(() => {
    seedData();
    client.send('message')
    client.onopen = () => {
      console.log('WebSocket Client Connected');
      client.send('MESSAGE');
    };
    client.onerror = (message) => {
      console.log("An error occured\n"+message);
      dispatch(getChannelData([[shiftingData[100]]]))
    };
    client.onmessage = (message: any) => {
      const eegData: any = JSON.parse(message.data);
      dispatch(getChannelData(eegData))
    };
    client.onclose = () => {
      console.log('closed');
    };
  }, []);  

  useEffect(()=>{
    if(currentData.length>0){
      let val = currentData[currentData.length - 1].channel1;
      updateData(val);
    }
  }, [currentData]);

  useEffect(()=>{
    drawChart()
  }, [shiftingData])

  //initialize the data being displayed in line chart
  function seedData(){
    let tempShiftingData: any = []
    for(let i=1;i<=100;i++){
      let flatData = {
        time: i,
        value: 0
      }
      tempShiftingData.push(flatData)
    }
    setShiftingData(tempShiftingData)
  }
  
  function updateData(val: number){
    let tempShiftingData = [...shiftingData]
    tempShiftingData.shift()
    tempShiftingData.map((obj: { time: number, value: number }) => {
      obj.time = obj.time-1
    })
    let newData = {
      time: 100,
      value: val
    }
    tempShiftingData.push(newData)
    setShiftingData(tempShiftingData)
  }

  function drawChart(){
    d3.select('#chart')
      .select('svg')
      .remove();

    const width = 300
    const height = 200
    const margin = { top: 50, right: 50, bottom: 50, left: 50 }

    const yMinVal = d3.min(shiftingData, d => d.value) as number
    const yMaxValue = d3.max(shiftingData, d => d.value) as number
    const xMinValue = 1   //d3.min(shiftingData, d => d.time)
    const xMaxValue = 100 //d3.max(shiftingData, d => d.time)
    
    const svg = d3
      .select('#chart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.bottom})`)
    //const tooltip = d3.select('#container').append('div').attr('class', 'tooltip');

    const xScale = d3.scaleLinear()
      .domain([xMinValue, xMaxValue]).range([0, width])
    const yScale = d3.scaleLinear()
      .range([height, 0])
      .domain([yMinVal, yMaxValue])
    const line = d3.line<dataType>()
      .x(d => xScale(d.time))
      .y(d => yScale(d.value))
      //curve(d3.curveMonotoneX);

      svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${height})`)
        .attr('color', 'black')
        .call(d3.axisBottom(xScale).tickSize(15));
      svg.append('g')
        .attr('class', 'y-axis')
        .attr('color', 'black')
        .call(d3.axisLeft(yScale));
      svg.append('path')
        .datum(shiftingData)
        .attr('fill', 'none')
        .attr('stroke', '#000000')
        .attr('stroke-width', 2)
        .attr('class', 'line') 
        .attr('d', line);
  }

  return <div id="chart"></div>
}
