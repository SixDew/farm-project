import { PressureSensorDto }from '../../interfaces/DtoInterfaces'
import './SectionElement.css'

interface SectionElementProps{
    name:string,
    sensors:PressureSensorDto[]
}

export default function SectionElement({name, sensors}:SectionElementProps){
    return(
        <div id='main-section-element'>
        <p>{name}</p>
        <div className='sensors'>
            <p>Датчики</p>
            {
                sensors.map(s=><div className='group' key={s.imei}>
                    <p>Imei:{s.imei}</p>
                </div>)
            }
        </div>
        </div>
    )
}