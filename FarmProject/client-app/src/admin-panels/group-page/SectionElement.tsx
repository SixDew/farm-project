import { ReactNode } from 'react'
import { AlarmablePressureSensor, PressureSensorDto }from '../../interfaces/DtoInterfaces'
import SensorMini from '../../sensors/SensorMini'
import './SectionElement.css'
import SensorInfoElement from './SensorInfoElement'

interface SectionElementProps{
    name:string,
    sensors:(AlarmablePressureSensor|undefined)[]
    children?:ReactNode,
    disabledSensors:PressureSensorDto[],
    className?:string,
    sensorsContainerClassName?:string
}

export default function SectionElement({name, sensors,children, disabledSensors, className, sensorsContainerClassName}:SectionElementProps){
    return(
        <div className={className?`${className}`:"section-element"}>
        <h3>{name}</h3>
        <div className={sensorsContainerClassName?`${sensorsContainerClassName}`:"sensors"}>
            {
                sensors?.filter(s=>s && !disabledSensors.find(ds=>ds.imei == s.imei)).map(s=>s && <SensorMini gps={s.gps} imei={s.imei} isAlarmed={s.isAlarmed} 
                    measurement1={s.lastMeasurement?.measurement1} 
                    measurement2={s.lastMeasurement?.measurement2}
                    key={s.imei}/>)
            }
        </div>
        <div>{children}</div>
        </div>
    )
}