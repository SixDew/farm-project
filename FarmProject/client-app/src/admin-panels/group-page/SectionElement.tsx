import { PressureSensorDto }from '../../interfaces/DtoInterfaces'
import './SectionElement.css'

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
                sensors.map(s=><div className='sensor-info-element' key={s.imei}>
                    <p>Сенсор:<p>{s.imei}</p></p>
                    <p>Координаты:<p>{s.gps}</p></p>
                </div>)
            }
        </div>
        </div>
    )
}