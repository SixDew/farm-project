import { AlarmablePressureSensor, PressureSensorDto } from '../../interfaces/DtoInterfaces'
import './SensorInfoElement.css'

interface SensorInfoElementProps{
    sensor:PressureSensorDto | AlarmablePressureSensor
}

export default function SensorInfoElement({sensor}:SensorInfoElementProps){
    return(
        <div className='sensor-info-element'>
                    <p>Сенсор:<p>{sensor.imei}</p></p>
                    <p>Координаты:<p>{sensor.gps}</p></p>
        </div>
    )
}