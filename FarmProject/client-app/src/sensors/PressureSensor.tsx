import { useEffect, useState } from "react";
import './PressureSensor.css'
import { useParams } from "react-router-dom";
import PressureMeasurementChart from "./PressureMeasurementChart";
import {getPressureSensorData, sendAlarmedMeasurementChecked } from './api/sensors-api'
import PressureSensorSettings from "./PressureSensorSettings";
import { AlarmablePressureSensor, PressureAlarmDto, PressureMeasurements, PressureSensorDto } from "../interfaces/DtoInterfaces";
import MeasurementsStatistic from "./MeasurementsStatistic";
import PageContentBase from "../PageContentBase";
import SensorDataElement from "./SensorDataElement";
import AlarmNotificationsInfo from "./AlarmNotificationsInfo";
import { AuthContextType, useAuth } from "../AuthProvider";

interface PressureSensorProps{
    sensors:AlarmablePressureSensor[]
    sensorOnDisalarm?:(sensor:AlarmablePressureSensor)=>void
    onDisableSensor?:()=>void
}

export default function PressureSensor({sensors, sensorOnDisalarm, onDisableSensor}:PressureSensorProps){
    const {imei} = useParams()
    const [sensor, setSensor] = useState<AlarmablePressureSensor>()
    const [alarmedMeasurements, setAlarmedMeasurements] = useState<PressureAlarmDto[]>([])
    const [checkedAlarmedMeasurements, setCheckedAlarmedMeasurements] = useState<PressureAlarmDto[]>([])
    const [legacyMeasurements, setLegacyMeasurements] = useState<PressureMeasurements[]>([])
    const authContext = useAuth()

    useEffect(()=>{
        setSensor(sensors.find(s=>s.imei == imei))
    }, [sensors])

    useEffect(()=>{
        setAlarmedMeasurements(sensor?.alarmedMeasurements? sensor.alarmedMeasurements : [])
    },[sensor?.alarmedMeasurements])
    
    useEffect(()=>{
        async function getSensorData() {
            var response = await authContext.sendWithAccessCheck(()=>getPressureSensorData(imei))
            if(response.ok){
                var measurements = (await response.json() as PressureSensorDto).measurements
                setLegacyMeasurements(measurements)
            }
        }
        getSensorData()
    }, [imei])


    return (
        <PageContentBase title={`Датчик ${imei}`}>
            <div className="sensor-main-container">
                <div className="sensor-info-container">
                    <SensorDataElement>
                         <div className='base-info-container'>
                            <div className="measurement-channels-container">
                                <h3>Последнее измерение</h3>
                                <p className="second-text bottom-border-main-color">Канал 1:</p><p className="second-text">{sensor?.lastMeasurement?.measurement1}</p>
                                <p className="second-text bottom-border-main-color">Канал 2:</p><p className="second-text">{sensor?.lastMeasurement?.measurement2}</p>
                            </div>
                        </div>
                    </SensorDataElement>
                    <SensorDataElement scrollable={true}>
                        <PressureSensorSettings imei={imei as string} role={localStorage.getItem('role') as string} onDisableSensor={onDisableSensor}/>
                    </SensorDataElement>
                    <SensorDataElement>
                        <MeasurementsStatistic 
                            imei={imei}
                            onGetCheckedAlarmMeasurements={(measurements)=>{
                                setCheckedAlarmedMeasurements(measurements)
                            }}
                        />
                    </SensorDataElement>
                    <SensorDataElement>
                        <AlarmNotificationsInfo alarmedMeasurements={alarmedMeasurements} onNotificationCheck={(id)=>onNotificationCheck(id, 
                            imei, 
                            sensor, 
                            sensorOnDisalarm, 
                            setAlarmedMeasurements, 
                            authContext)}/>
                    </SensorDataElement>
                </div>
                {
                    sensor  && <PressureMeasurementChart 
                    measurements={sensor.lastMeasurement ? sensor.lastMeasurement : undefined} 
                    legacyMeasurements={legacyMeasurements} 
                    alarmedMeasurements={sensor.alarmedMeasurements}
                    checkedAlarmedMeasurements={checkedAlarmedMeasurements}
                    alarmCheckedEvent={(id:number)=>onNotificationCheck(id, imei, sensor, sensorOnDisalarm, setAlarmedMeasurements, authContext)}/>
                }
            </div>
        </PageContentBase>
    )
}

export async function onNotificationCheck(id:number, imei:string | undefined, sensor: AlarmablePressureSensor | undefined,
    sensorOnDisalarm:((sensor:AlarmablePressureSensor)=>void) | undefined,
    setAlarmedMeasurements:React.Dispatch<React.SetStateAction<PressureAlarmDto[]>>, authContext:AuthContextType){
        if(imei && sensor){
            const response = await authContext.sendWithAccessCheck(()=>sendAlarmedMeasurementChecked(id, imei))
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