import { AlarmablePressureSensor, PressureSensorDto }from '../../interfaces/DtoInterfaces'
import SensorMini from '../../sensors/SensorMini'
import './SectionElement.css'
import SensorInfoElement from './SensorInfoElement'

interface SectionElementProps{
    name:string,
    sensors:(AlarmablePressureSensor|undefined)[]
}

export default function SectionElement({name, sensors}:SectionElementProps){
    return(
        <div className='section-element'>
        <h3>{name}</h3>
        <div className='sensors'>
            {
                sensors?.map(s=>s && <SensorMini gps={s.gps} imei={s.imei} isAlarmed={s.isAlarmed} 
                    measurement1={s.lastMeasurement?.measurement1} 
                    measurement2={s.lastMeasurement?.measurement2}
                    key={s.imei}/>)
            }
        </div>
        </div>
    )
}