import { useNavigate } from 'react-router-dom'
import './SensorMini.css'

interface SensorMiniProps{
    imei:string,
    gps:string,
    measurement1?:number,
    measurement2?:number,
    isAlarmed:boolean
}

export default function SensorMini({imei, gps, measurement1, measurement2, isAlarmed}:SensorMiniProps){
    const navigate = useNavigate()
    
    return (
        <div className={`sensor-mini${isAlarmed?' alarmed':''}`} onClick={()=>navigate(`/sensors/pressure/${imei}`)}>
            <p>Датчик:{imei}</p>
            <p>GPS:{gps}</p>
            <p>Канал1:{measurement1}</p>
            <p>Канал2:{measurement2}</p>
        </div>
    )
}