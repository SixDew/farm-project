import './App.css'
import SensorsMiniContainer from './SensorsMiniContainer'
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import PressureSensor from './PressureSensor'
import LoginPage from '../LoginPage'
import AdminPage from '../AdminPage'
import GroupPage from '../admin-panels/GroupPage'
import SensorsToAddPage from '../admin-panels/SensorsToAddPage'
import MapPage from '../admin-panels/map-page/MapPage'

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