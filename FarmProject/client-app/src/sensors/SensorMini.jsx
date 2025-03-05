import { useNavigate } from 'react-router-dom'
import './SensorMini.css'

export default function SensorMini({imei, gps, measurement1, measurement2, isAlarmed}){
    const navigate = useNavigate()
    
    return (
        <>
        {
            isAlarmed ? (
                <div className="sensor-mini alarmed" onClick={()=>navigate(`/sensors/pressure/${imei}`)}>
                    <p>Imei:{imei}</p>
                    <p>GPS:{gps}</p>
                    <p>M1:{measurement1}</p>
                    <p>M2:{measurement2}</p>
                </div>
            ) : (
                <div className="sensor-mini" onClick={()=>navigate(`/sensors/pressure/${imei}`)}>
                    <p>Imei:{imei}</p>
                    <p>GPS:{gps}</p>
                    <p>M1:{measurement1}</p>
                    <p>M2:{measurement2}</p>
                </div>
            )
        }</>
    )
}