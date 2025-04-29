import { useState } from "react"
import { PressureAlarmDto, PressureMeasurements } from "../interfaces/DtoInterfaces"
import { getCheckedAlarmedMeasurements, getPressureSensorData } from "./api/sensors-api"
import './MeasurementsStatistic.css'
import StatisticChart from "./StatisticChart"

interface MeasurementsStatisticProps{
    onGetCheckedAlarmMeasurements?:(measurements:PressureAlarmDto[])=>void,
    imei?:string
}

export default function MeasurementsStatistic({onGetCheckedAlarmMeasurements, imei}:MeasurementsStatisticProps){
    const [historyAlarmMeasurements, setHistoryAlarmMeasurements] = useState<PressureAlarmDto[]>([])
    const [legacyMeasurements, setLegacyMeasurements] = useState<PressureMeasurements[]>([])

    async function getHistoryData() {
        if(imei){
            const legacyData = await getPressureSensorData(imei, ()=>{})
            const alarmedMeasurementsResponse = await getCheckedAlarmedMeasurements(imei)
            if(alarmedMeasurementsResponse.ok){
                const data = await alarmedMeasurementsResponse.json()
                onGetCheckedAlarmMeasurements && onGetCheckedAlarmMeasurements(data)
                setHistoryAlarmMeasurements(data)
            }
            if(legacyData){
                setLegacyMeasurements(legacyData.measurements)
            }
        }
    }
    
    return (
        <div className="measurements-statisitc-container">
            <button className="history-data-button" onClick={getHistoryData}>Получить исторические данные</button>
            {
                legacyMeasurements.length > 0 && (
                    <>
                        <div className="statistic-chart-contaier">
                            <StatisticChart historyAlarmedMeasurementsCount={historyAlarmMeasurements.length}
                                lagacyMeasurementsCount={legacyMeasurements.length}
                            />
                        </div>
                    </>
                )
            }
        </div>
    )
}