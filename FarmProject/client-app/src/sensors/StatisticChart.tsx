import { useEffect, useRef, useState } from "react"
import ReactECharts from 'echarts-for-react'

interface StatisticChartProps{
    lagacyMeasurementsCount:number,
    historyAlarmedMeasurementsCount:number
}

export default function StatisticChart({lagacyMeasurementsCount, historyAlarmedMeasurementsCount}:StatisticChartProps){
    const chart = useRef<ReactECharts>(null)
    const [option, setOptions] = useState<any>()

    useEffect(()=>{
        setOptions({
            tooltip: {
                trigger: 'item',
                formatter: function (params: any) {
                    const { percent } = params;

                    return `${percent}%`;
                }   
              },
              legend: {
                top: '5%',
                left: 'center',
              },
              series: [
                {
                  name: 'Access From',
                  type: 'pie',
                  radius: ['0%', '70%'],
                  avoidLabelOverlap: false,
                  itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                  },
                  label: {
                    show: false,
                    position: 'center',
                  },
                  emphasis: {
                    label: {
                      show: true,
                      fontSize: 20,
                      fontWeight: 'bold'
                    }
                  },
                  labelLine: {
                    show: false
                  },
                  data: [
                    { value: lagacyMeasurementsCount - historyAlarmedMeasurementsCount, name: 'Хорошие измерения', itemStyle:{color: '#64b4c8'}},
                    { value: historyAlarmedMeasurementsCount, name: 'Предупреждения', itemStyle:{color: '#c8230a'} },
                  ]
                }
              ]
          })
    }, [lagacyMeasurementsCount, historyAlarmedMeasurementsCount])
    
    return (
        <ReactECharts option={option ? option : {}} ref={chart}></ReactECharts>
    )
}