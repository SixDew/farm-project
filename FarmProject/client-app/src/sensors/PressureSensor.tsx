import { Fragment, useEffect, useState } from "react";
import './PressureSensor.css'
import { useNavigate, useParams } from "react-router-dom";
import PressureMeasurementChart from "./PressureMeasurementChart";
import {getPressureSensorData, sendAlarmedMeasurementChecked } from './api/sensors-api'
import PressureSensorSettings from "./PressureSensorSettings";
import AlarmNotification from "./AlarmNotification";
import { AlarmablePressureSensor, PressureAlarmDto, PressureMeasurements, PressureSensorDto } from "../interfaces/DtoInterfaces";

interface PressureSensorProps{
    sensors:AlarmablePressureSensor[]
    sensorOnDisalarm?:(sensor:AlarmablePressureSensor)=>void
}

export default function PressureSensor({sensors, sensorOnDisalarm}:PressureSensorProps){
    const navigate = useNavigate()
    const {imei} = useParams()
    const [sensor, setSensor] = useState<AlarmablePressureSensor>()
    const [alarmedMeasurements, setAlarmedMeasurements] = useState<PressureAlarmDto[]>([])
    const [legacyMeasurements, setLegacyMeasurements] = useState<PressureMeasurements[]>([])
    const [showSettings, setShowSettings] = useState(false)

    useEffect(()=>{
        setSensor(sensors.find(s=>s.imei == imei))
    }, [sensors])

    useEffect(()=>{
        setAlarmedMeasurements(sensor?.alarmedMeasurements? sensor.alarmedMeasurements : [])
    },[sensor?.alarmedMeasurements])
    
    useEffect(()=>{
        async function getSensorData() {
            getPressureSensorData(imei, ()=>{navigate('/login')})
            .then((data:PressureSensorDto)=>setLegacyMeasurements(data.measurements))
        }
        getSensorData()
    }, [imei])


    return (
        <Fragment>
            <div id='main-info-container'>
            <div id='base-info-container'>
            <button onClick={()=>navigate('/')} id="back-button">Назад</button>
            <h1>Imei:{imei}</h1>
            <h2>M1:{sensor?.lastMeasurement?.measurement1}</h2>
            <h2>M2:{sensor?.lastMeasurement?.measurement2}</h2>
            </div>

            <div id="notifucations-info-container">
                {alarmedMeasurements.map((n, index)=><AlarmNotification measurement1={n.measurement1} measurement2={n.measurement2} date={n.measurementsTime} key={index}
                onCheck={()=>onNotificationCheck(n.id, imei, sensor, sensorOnDisalarm, setAlarmedMeasurements)}/>)}
            </div>
            
            <div id='settings-container'>
                <button id='show-settings' onClick={()=>setShowSettings((prev)=>!prev)}>Настройки</button>
                {showSettings? <PressureSensorSettings imei={imei as string} role={localStorage.getItem('role') as string}/> : null}
            </div>

            </div>

            {
                sensor  && <PressureMeasurementChart measurements={sensor.lastMeasurement ? sensor.lastMeasurement : undefined} legacyMeasurements={legacyMeasurements} alarmedMeasurements={sensor.alarmedMeasurements} 
                alarmCheckedEvent={(id:number)=>onNotificationCheck(id, imei, sensor, sensorOnDisalarm, setAlarmedMeasurements)}/>
            }
        </Fragment>
    )
}

async function onNotificationCheck(id:number, imei:string | undefined, sensor: AlarmablePressureSensor | undefined,
    sensorOnDisalarm:((sensor:AlarmablePressureSensor)=>void) | undefined,
    setAlarmedMeasurements:React.Dispatch<React.SetStateAction<PressureAlarmDto[]>>){
        if(imei && sensor){
            const response = await sendAlarmedMeasurementChecked(id, imei)
            if(response.ok){
                const newAlarmedMeasurements = sensor.alarmedMeasurements.filter(m=>m.id != id)
                sensor.alarmedMeasurements = newAlarmedMeasurements
                setAlarmedMeasurements(sensor.alarmedMeasurements)
                
            }
            if(sensor.alarmedMeasurements.length == 0 ){
                sensorOnDisalarm && sensorOnDisalarm(sensor)
            }
        }
}