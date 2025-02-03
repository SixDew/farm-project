import { useEffect, useState } from 'react'
import { getAllPressureSensors } from './api/sensors-api.js'
import './App.css'
import SensorsMiniContainer from './SensorsMiniContainer.jsx'
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import PressureSensor from './PressureSensor.jsx'

export default function App(){
    let [sensors, setSensors] = useState([])
    useEffect(()=>{
        async function getSensors() {
            const data = await getAllPressureSensors()
            setSensors(data)
        }
        getSensors()
    },[])

    return (
        <div className='sensors-main-container'>
        <Router>
            <Routes>
            <Route path='/' element={<SensorsMiniContainer sensors={sensors}/>}/>
            <Route path='/sensors/pressure/:imei' element={<PressureSensor/>}/>
            </Routes>
        </Router>
        </div>
    )
}