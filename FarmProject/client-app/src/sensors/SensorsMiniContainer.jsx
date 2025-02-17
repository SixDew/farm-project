import { useNavigate } from "react-router-dom"
import SensorMini from "./SensorMini.jsx"
import './SensorsMiniContainer.css'
import { useEffect, useState } from "react"
import { getAllPressureSensors } from "./api/sensors-api.js"

export default function SensorsMiniContainer(){
    const navigate = useNavigate()
    let [sensors, setSensors] = useState([])
    
    useEffect(()=>{
        async function getSensors() {
            const response = await getAllPressureSensors()
            if(response.ok){
                const data = await response.json()
                setSensors(data)
            }
            if(response.status === 401){
                navigate('/login')
            }
        }
        getSensors()
    },[])

    return (
        <div className="sensors-mini-container">
            {
            sensors.map((sensor)=> <SensorMini key={sensor.imei} imei={sensor.imei} gps={sensor.gps}></SensorMini>)
        }
        </div>
    )
}