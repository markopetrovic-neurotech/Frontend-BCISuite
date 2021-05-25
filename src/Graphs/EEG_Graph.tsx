/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/order */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Label,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts';
import * as d3 from "d3";
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

  interface dataType { time: number, value: number }
  const dispatch = useDispatch()
  const currentData = useSelector((state : any) => state.allChannelsReducer.currentData)
  const [shiftingData, setShiftingData] = useState<dataType[]>([])

  useEffect(() => {
    seedData();
    client.onopen = () => {
      console.log('WebSocket Client Connected');
      client.send('MESSAGE');
    };

    client.onerror = (message) => {
      console.log(message);
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
    let val = currentData[currentData.length - 1].channel1;
    console.log(val);
    updateData(val);
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
      //push object to end of array
      tempShiftingData.push(flatData)
    }
    setShiftingData(tempShiftingData)
  }
  
  function updateData(val: number){
    let tempShiftingData = shiftingData
    //(shift removes first element, shifting might make implementation easier)
    tempShiftingData.pop()
    tempShiftingData.map((obj: { time: number, value: number }) => {
      obj.time = obj.time+1
    })
    let newData = {
      time: 1,
      value: val
    }
    tempShiftingData.unshift(newData)
    setShiftingData(tempShiftingData)
  }

  function drawChart(){
    d3.select('#chart')
      .select('svg')
      .remove();

    const width = 300
    const height = 100
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
      .domain([0, yMaxValue])
    const line = d3.line<dataType>()
      .x(d => xScale(d.time))
      .y(d => yScale(d.value))
      //curve(d3.curveMonotoneX);
    
      svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale).tickSize(15));
      svg.append('g')
        .attr('class', 'y-axis')
        .call(d3.axisLeft(yScale));
      svg.append('path')
        .datum(shiftingData)
        .attr('fill', 'none')
        .attr('stroke', '#f6c3d0')
        .attr('stroke-width', 4)
        .attr('class', 'line') 
        .attr('d', line);
  }

  return (
    <div>
      <LineChart
        width={800}
        height={400}
        data={currentData}
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
      <hr />
      <div id="chart"></div>
    </div>
  );
}
