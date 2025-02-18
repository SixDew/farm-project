import { useNavigate } from "react-router-dom"
import SensorMini from "./SensorMini.jsx"
import './SensorsMiniContainer.css'
import { Fragment, useEffect, useState } from "react"
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
        <Fragment>
            <div>
                <button id="exit-button" onClick={()=>{
                    localStorage.setItem('userKey', '')
                    navigate('/login')
                }}>Выйти</button>
            </div>
            <div className="sensors-mini-container">
            {
            sensors.map((sensor)=> <SensorMini key={sensor.imei} imei={sensor.imei} gps={sensor.gps}></SensorMini>)
        }
        </div>
        </Fragment>
    )
}