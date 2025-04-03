import ReactECharts from 'echarts-for-react'
//импортировать только нужное в будущем
import { useEffect, useState, useRef, useMemo } from 'react';

export default function PressureMeasurementChart({measurements, legacyMeasurements, alarmedMeasurements, alarmCheckedEvent}){
    const [measurements1, setMeasurements1] = useState([])
    const [measurements2, setMeasurements2] = useState([])
    const [dates, setDates] = useState([])
    const [markPointsData, setMarkPointsData] = useState([])
    const chart = useRef(null)

    const initOption = useMemo(()=>{
      return {
        title: {
          text: 'График давления'
        },
        tooltip: {},
        legend: {
          data: ['Измерения 1', 'Измерения 2', 'Предупреждения']
        },
        xAxis: {
          data: []
        },
        yAxis: {},
        series: [
          {
            name: 'Измерения 1',
            type: 'line',
            data: []
          },
          {
            name: 'Измерения 2',
            type: 'line',
            data: []
          },
          {
            name:'Предупреждения',
            type: 'scatter',
            data:[],
            markPoint:{
              data: markPointsData,
              symbolSize: 30
            }
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
      setMeasurements1((prev)=>[...prev, ...legacyMeasurements.map(data=>data.measurement1)])
      setMeasurements2((prev)=>[...prev, ...legacyMeasurements.map(data=>data.measurement2)])
      setDates((prev)=>[...prev, ...legacyMeasurements.map(data=>new Date(data.measurementsTime).toLocaleString())])
    },[legacyMeasurements])

    useEffect(()=>{
        if(measurements){
          setMeasurements1((prev)=>[...prev, measurements.measurement1])
          setMeasurements2((prev)=>[...prev, measurements.measurement2])
          setDates((prev)=>[...prev, new Date(data.measurementsTime).toLocaleString()])
        }
    },[measurements])

    useEffect(()=>{
      setMarkPointsData(alarmedMeasurements.map(d=>{
        return { coord:[new Date(d.measurementsTime).toLocaleString(), 0], y:'20%', alarmMeasurementId:d.id }
      }))
    }, [alarmedMeasurements])

    useEffect(()=>{
      setOption(measurements1, measurements2, chart, dates, markPointsData)
    }, [measurements1, measurements2, dates, markPointsData])

    useEffect(()=>{
      chart.current.getEchartsInstance().on('click', {seriesName: 'Предупреждения', componentType:'markPoint'}, (params)=>{
        alarmCheckedEvent(params.data.alarmMeasurementId)
      })
    }, [])

    return (
        <ReactECharts option={initOption} ref={chart}></ReactECharts>
    )
}

function setOption(measurements1, measurements2, chart, dates, markPointsData){
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
      },
      {
        name:'Предупреждения',
        type: 'scatter',
        data:[],
        markPoint:{
          data: markPointsData,
          symbolSize: 30
        }
      }
    ],
    xAxis:{
      data: dates
    }
  }

  chart.current.getEchartsInstance().setOption(option)
}