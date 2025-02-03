import { useNavigate } from 'react-router-dom'
import './SensorMini.css'

export default function SensorMini({imei, gps}){
    const navigate = useNavigate()
    
    return (
        <div className="sensor-mini" onClick={()=>navigate(`/sensors/pressure/${imei}`)}>
            <p>Imei:{imei}</p>
            <p>GPS:{gps}</p>
        </div>
    )
}