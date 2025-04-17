import './App.css'
import SensorsMiniContainer from './sensors/SensorsMiniContainer'
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import PressureSensor from './sensors/PressureSensor'
import LoginPage from './LoginPage'
import AdminPage from './admin-panels/AdminPage'
import GroupPage from './admin-panels/group-page/GroupPage'
import SensorsToAddPage from './admin-panels/SensorsToAddPage'
import MapPage from './admin-panels/map-page/MapPage'
import { FacilityDeepMetaDto, FacilityDto } from './interfaces/DtoInterfaces'
import { useEffect, useState } from 'react'
import { getFacilitiesDeppMeta, getFacility } from './sensors/api/sensors-api'
import FacilitySelect from './main-menu/FacilitySelect'

export default function App(){
    const [facilitiesMeta, setFacilitiesMeta] = useState<FacilityDeepMetaDto[]>([])
    const [selectedFacility, setSelectedFacility] = useState<FacilityDto>()

    async function onFacilitySelect(e:React.ChangeEvent<HTMLSelectElement>){
        const facilityId = Number(e.target.value)
        const response = await getFacility(facilityId)
        if(response.ok){
            setSelectedFacility(await response.json())
        }
        else{
            setSelectedFacility(undefined)
        }
    }

    useEffect(()=>{
        console.log("Current facility:", selectedFacility)
    }, [selectedFacility])

    useEffect(()=>{
        async function facilitiesMetaInit() {
            var response = await getFacilitiesDeppMeta()
            if(response.ok){
                setFacilitiesMeta(await response.json())
            }
        }
        facilitiesMetaInit()
    }, [])

    return (
        <div className='main-app-container'>
        <Router>
            <Routes>
                <Route path='/login' element={<LoginPage/>}/>
                <Route path='/' element={<SensorsMiniContainer/>}/>
                <Route path='/sensors/pressure/:imei' element={<PressureSensor/>}/>
                <Route path='/admin' element={<AdminPage/>}/>
                <Route path='/groups' element={<GroupPage/>}/>
                <Route path='/disabled' element={<SensorsToAddPage/>}/>
                <Route path='/map' element={<MapPage facility={selectedFacility}/>}/>
            </Routes>

            <div className='main-menu'>
            <FacilitySelect facilitiesMeta={facilitiesMeta} onSelectEvent={onFacilitySelect}></FacilitySelect>
            </div>
        </Router>
        </div>
        
    )
}