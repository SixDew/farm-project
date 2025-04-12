import { useEffect, useState } from 'react'
import { getAllPressureSensors } from './api/sensors-api.js'
import './App.css'
import SensorsMiniContainer from './SensorsMiniContainer.jsx'
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import PressureSensor from './PressureSensor.jsx'
import LoginPage from '../LoginPage.jsx'
import AdminPage from '../AdminPage.jsx'
import GroupPage from '../admin-panels/GroupPage.jsx'
import SensorsToAddPage from '../admin-panels/SensorsToAddPage.jsx'
import MapPage from '../admin-panels/MapPage.jsx'

export default function App(){
    return (
        <div className='sensors-main-container'>
        <Router>
            <Routes>
                <Route path='/login' element={<LoginPage/>}/>
                <Route path='/' element={<SensorsMiniContainer/>}/>
                <Route path='/sensors/pressure/:imei' element={<PressureSensor/>}/>
                <Route path='/admin' element={<AdminPage/>}/>
                <Route path='/groups' element={<GroupPage/>}/>
                <Route path='/disabled' element={<SensorsToAddPage/>}/>
                <Route path='/map' element={<MapPage/>}/>
            </Routes>
        </Router>
        </div>
    )
}