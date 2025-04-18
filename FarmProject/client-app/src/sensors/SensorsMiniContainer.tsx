import { useNavigate } from "react-router-dom"
import SensorMini from "./SensorMini"
import './SensorsMiniContainer.css'
import { Fragment } from "react"
import { AlarmablePressureSensor, FacilityDto } from "../interfaces/DtoInterfaces"

interface SensorsMiniConteinerProps{
    facility?:FacilityDto
    sensors?:AlarmablePressureSensor[]
    alarmedSensors?:AlarmablePressureSensor[]
}

export default function SensorsMiniContainer({facility, sensors, alarmedSensors}:SensorsMiniConteinerProps){
    const nav = useNavigate()

    return (
        <Fragment>
            <div>
                <button id="exit-button" onClick={()=>{
                    localStorage.setItem('userKey', '')
                    nav('/login')
                }}>Выйти</button>
            </div>
            <div className="sensors-mini-container">
                {
                    alarmedSensors && alarmedSensors.map(sensor=><SensorMini key={sensor.imei} imei={sensor.imei} gps={sensor.gps}
                         measurement1={sensor.lastMeasurement ? sensor.lastMeasurement.measurement1 : 0} 
                         measurement2={sensor.lastMeasurement ? sensor.lastMeasurement.measurement2 : 0} 
                         isAlarmed={sensor.isAlarmed}></SensorMini>)
                }
            </div>
            <div className="sections-mini-container">
                {
                    facility?.groups.map(g=><div className="groups-mini-container">
                        <h4>{g.name}</h4>
                        {
                            g.sensors && sensors && (
                                g.sensors.map(sensor=>{
                                    const s = sensors.find(s=>s.imei == sensor.imei)
                                    if(s){
                                        return <SensorMini key={s.imei} imei={s.imei} gps={s.gps}
                                        measurement1={s.lastMeasurement ? s.lastMeasurement.measurement1 : 0} 
                                        measurement2={s.lastMeasurement ? s.lastMeasurement.measurement2 : 0} 
                                        isAlarmed={s.isAlarmed}></SensorMini>
                                    }
                                })
                            )
                        }
                    </div>)
                }
            </div>
            <div className="sensors-mini-container">
                {
                    sensors && sensors.map((sensor)=> <SensorMini key={sensor.imei} imei={sensor.imei} gps={sensor.gps}
                    measurement1={sensor.lastMeasurement ? sensor.lastMeasurement.measurement1 : 0} 
                    measurement2={sensor.lastMeasurement ? sensor.lastMeasurement.measurement2 : 0} 
                    isAlarmed={sensor.isAlarmed}></SensorMini>)
                }
            </div>
        </Fragment>
    )
}