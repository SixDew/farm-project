import ReactECharts from 'echarts-for-react'
//импортировать только нужное в будущем
import { useEffect, useState, useRef, useMemo } from 'react';

export default function PressureMeasurementChart({measurement1, measurement2}){
    const [measurements1, setMeasurements1] = useState([])
    const [measurements2, setMeasurements2] = useState([])
    const chart = useRef(null)

    const initOption = useMemo(()=>{
      return {
        title: {
          text: 'График давления'
        },
        tooltip: {},
        legend: {
          data: ['Измерения 1', 'Измерения 2']
        },
        xAxis: {
          data: [...Array(1000).keys()].map(i=>i+1)
        },
        yAxis: {},
        series: [
          {
            name: 'Измерения 1',
            type: 'line',
            data: measurements1
          },
          {
            name: 'Измерения 2',
            type: 'line',
            data: measurements2
          }
        ],
        dataZoom:[
            {
                type: 'slider',
                start: 0,
                end: 100
            },
            {
              type: 'inside',
              start: 0,
              end: 100
          }
        ]
      }
    }, [])

    useEffect(()=>{
        setMeasurements1((prev)=>[...prev, measurement1])
        setMeasurements2((prev)=>[...prev, measurement2])

        const option = {
          series: [
            {
              name: 'Измерения 1',
              type: 'line',
              data: measurements1
            },
            {
              name: 'Измерения 2',
              type: 'line',
              data: measurements2
            }
          ],
        }

        chart.current.getEchartsInstance().setOption(option)
    },[measurement1,measurement2])
    return (
        <ReactECharts option={initOption} ref={chart}></ReactECharts>
    )
}