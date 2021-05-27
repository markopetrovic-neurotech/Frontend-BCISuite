import React from 'react'
import {
    Label,
    Line,
    LineChart,
    XAxis,
    YAxis,
  } from 'recharts';

export default function EEGGraphRecharts(props: any){

    return (
        <LineChart
            width={800}
            height={400}
            data={props.currentData}
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
    )
}