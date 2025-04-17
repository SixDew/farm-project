import './App.css'
import SensorsMiniContainer from './sensors/SensorsMiniContainer'
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import PressureSensor from './sensors/PressureSensor'
import LoginPage from './LoginPage'
import AdminPage from './admin-panels/AdminPage'
import GroupPage from './admin-panels/group-page/GroupPage'
import SensorsToAddPage from './admin-panels/SensorsToAddPage'
import MapPage from './admin-panels/map-page/MapPage'
import { AlarmablePressureSensor, FacilityDeepMetaDto, FacilityDto, PressureAlarmDto, PressureMeasurements, PressureSensorDto } from './interfaces/DtoInterfaces'
import { useEffect, useState } from 'react'
import { getAlarmedMeasurements, getFacilitiesDeppMeta, getFacility } from './sensors/api/sensors-api'
import FacilitySelect from './main-menu/FacilitySelect'
import connection from "./sensors/api/measurements-hub-connection.js"

function convertSensorsFromServerData(data:PressureSensorDto[] | undefined):AlarmablePressureSensor[]{
    if(data){
        return data.map(sensor=>{
            return {imei:sensor.imei, gps:sensor.gps, measurement1:0, measurement2:0, isAlarmed:false, alarmedMeasurements:[]}
        })
    }
    else{
        return []
    }
}

function setMeasurementsData(data:PressureMeasurements, sensors:AlarmablePressureSensor[]){
    const sensor = sensors.find(s=>s.imei == data.imei)
    if(sensor){
        sensor.measurement1 = data.measurement1
        sensor.measurement2 = data.measurement2
    }
}

function addSensorToAlarm(sensor:AlarmablePressureSensor, alarmedSensors:AlarmablePressureSensor[],
    setAlarmedSensors:React.Dispatch<React.SetStateAction<AlarmablePressureSensor[]>>){
        sensor.isAlarmed = true
        if(!alarmedSensors.find(s=>s.imei==sensor.imei)){
            alarmedSensors.push(sensor)
            setAlarmedSensors([...alarmedSensors])
        }
}

function alarmEvent(sensors:AlarmablePressureSensor[], alarmedSensors:AlarmablePressureSensor[],
    data:PressureAlarmDto,
    setAlarmedSensors:React.Dispatch<React.SetStateAction<AlarmablePressureSensor[]>>){
        const sensor = sensors.find(s=>s.imei == data.imei)
        if(sensor){
            sensor.alarmedMeasurements.push(data)
            addSensorToAlarm(sensor, alarmedSensors, setAlarmedSensors)
        }
}

export default function App(){
    const [facilitiesMeta, setFacilitiesMeta] = useState<FacilityDeepMetaDto[]>([])
    const [selectedFacility, setSelectedFacility] = useState<FacilityDto>()
    const [sensors, setSensors] = useState<AlarmablePressureSensor[]>([])
    const [alarmedSensors, setAlarmedSensors] = useState<AlarmablePressureSensor[]>([])

    useEffect(()=>{
        console.log('alarmed sensors on mainapp:', alarmedSensors)
    }, [alarmedSensors])

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
        const sensorsBuffer:PressureSensorDto[] = []
        selectedFacility?.sections.forEach(section=>section.sensors.forEach(sensor=>sensorsBuffer.push(sensor)))
        setSensors(convertSensorsFromServerData(sensorsBuffer))

    }, [selectedFacility])

    useEffect(()=>{
        async function setConnection() {
            if(connection.state === 'Disconnected'){
                await connection.start()
                .then(()=>{console.log("StartConnection")})
                .catch((err)=>{console.error("Connection Error", err)})
            }

            if(connection.state === 'Connected'){
                sensors.forEach(sensor=>{
                    connection.invoke("AddPressureClientToGroup", sensor.imei).catch((err)=>console.error("add to group error", err))
                })
            }

            connection.on('ReciveMeasurements',(data:PressureMeasurements)=>{
                const updateSensors = [...sensors]
                setMeasurementsData(data, updateSensors)
                setSensors(updateSensors)
            })

            connection.on('ReciveAlarmNotify', (data:PressureAlarmDto)=>{
                alarmEvent(sensors, alarmedSensors, data, setAlarmedSensors)
            })
        }
        setConnection()

        return ()=>{
            connection.off('ReciveMeasurements')
            if(connection.state === 'Connected'){
                sensors.forEach(sensor=>connection.invoke('RemovePressureClientFromGroup', sensor.imei))
            }
        }
    },[sensors])

    useEffect(()=>{
        async function getAlarmedMeasurementsAsync() {
            for(const sensor of sensors){
                var response = await getAlarmedMeasurements(sensor.imei)
                if(response.ok){
                    var alarmedMeasurementsList:PressureAlarmDto[] = await response.json()
                    for(const measurement of alarmedMeasurementsList){
                        if(!measurement.isChecked){
                            if(!sensor.alarmedMeasurements.find(m=>m.id == measurement.id)){
                                sensor.alarmedMeasurements.push(measurement)
                            }
                            addSensorToAlarm(sensor, alarmedSensors, setAlarmedSensors)
                        }
                    }
                }
            }
        }
        getAlarmedMeasurementsAsync()
    }, [sensors])
    

    useEffect(()=>{
        console.log("Current facility:", selectedFacility)
    }, [selectedFacility])

    useEffect(()=>{
        console.log("sensors:", sensors)
    },[sensors])

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
                <Route path='/map' element={<MapPage facility={selectedFacility} sensors={sensors} alarmedSenosrs={alarmedSensors}/>}/>
            </Routes>

            <div className='main-menu'>
            <FacilitySelect facilitiesMeta={facilitiesMeta} onSelectEvent={onFacilitySelect}></FacilitySelect>
            </div>
        </Router>
        </div>
        
    )
}