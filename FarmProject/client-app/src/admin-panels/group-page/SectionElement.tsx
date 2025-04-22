import { PressureSensorDto }from '../../interfaces/DtoInterfaces'
import './SectionElement.css'
import SensorInfoElement from './SensorInfoElement'

interface SectionElementProps{
    name:string,
    sensors:PressureSensorDto[]
}

export default function SectionElement({name, sensors}:SectionElementProps){
    return(
        <div className='section-element'>
        <h3>{name}</h3>
        <div className='sensors'>
            {
                sensors.map(s=><SensorInfoElement sensor={s} key={s.imei}/>)
            }
        </div>
        </div>
    )
}