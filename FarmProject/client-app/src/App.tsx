import './App.css'
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import PressureSensor from './sensors/PressureSensor'
import LoginPage from './LoginPage'
import UsersPage from './admin-panels/UsersPage'
import GroupPage from './admin-panels/group-page/GroupPage'
import SensorsToAddPage from './admin-panels/SensorsToAddPage'
import MapPage from './admin-panels/map-page/MapPage'
import { AlarmablePressureSensor, MeasurementsDriftData, FacilityDeepMetaDto, FacilityDto, NotificationData, PressureAlarmDto, PressureMeasurements, PressureSensorDto, ForecastWarningNotificationData, AlarmMeasurementsNotificationData } from './interfaces/DtoInterfaces'
import { useEffect, useState } from 'react'
import {getDisabledSensors, getFacilitiesDeppMeta, getFacility, getNotifications, getUncheckedAlarmedMeasurements, getUncheckedNotifications } from './sensors/api/sensors-api'
import FacilitySelect from './main-menu/FacilitySelect'
import connection from "./sensors/api/measurements-hub-connection.js"
import NavButton from './main-menu/NavButton'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import mapImage from './images/white-map.png';
import peopleImage from './images/white-people.png'
import sensorImage from './images/white-sensor.png'
import disabledSensorImage from './images/white-disabled2.png'
import Popup from 'reactjs-popup'
import NotificationMenuElement from './NotificationMenuElement'

import bellImage from './images/bell-white.png'
import logoImage from './images/logo.png'

function convertSensorsFromServerData(data:PressureSensorDto[] | undefined):AlarmablePressureSensor[]{
    if(data){
        return data.map(sensor=>{
            return {imei:sensor.imei, gps:sensor.gps, lastMeasurement:null, isAlarmed:false, alarmedMeasurements:[]}
        })
    }
    else{
        return []
    }
}

function setMeasurementsData(data:PressureMeasurements, sensors:AlarmablePressureSensor[]){
    const sensor = sensors.find(s=>s.imei == data.imei)
    if(sensor){
        sensor.lastMeasurement = data
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
            sensor.alarmedMeasurements = [...sensor.alarmedMeasurements]
            addSensorToAlarm(sensor, alarmedSensors, setAlarmedSensors)
        }
}

const notificationsLimit = 5;

export default function App(){
    const [facilitiesMeta, setFacilitiesMeta] = useState<FacilityDeepMetaDto[]>([])
    const [selectedFacility, setSelectedFacility] = useState<FacilityDto>()
    const [sensors, setSensors] = useState<AlarmablePressureSensor[]>([])
    const [alarmedSensors, setAlarmedSensors] = useState<AlarmablePressureSensor[]>([])
    const [disabledSensors, setDisabledSensors] = useState<PressureSensorDto[]>([])

    const [notifications, setNotifications] = useState<NotificationData[]>([])


    async function loadNotifications() {
        var userIdString:string | null = localStorage.getItem("userId")
        if(userIdString){
            var response = await getNotifications(Number.parseInt(userIdString), notifications.length, notificationsLimit)
            var notificationsData = await response.json()
            setNotifications(prev=>[...prev, ...notificationsData])
        }
    }

    function addNotification(data:NotificationData){
        setNotifications(prev=>[data, ...prev])
    }

    useEffect(()=>{
        loadNotifications()
    }, [])

    function showDriftNotification(measurementData:MeasurementsDriftData, notificationData:NotificationData){
        toast.warning(
        <div>
            <h3>Обнаружен дрифт измерений</h3>
            <p>{notificationData.text}</p>
            <NavButton navPath={`/sensors/pressure/${measurementData.imei}`} title='Перейти'></NavButton>
        </div>)
    }

    function showAlarmMeasurementNotification(measurementData:PressureAlarmDto, notificationData:NotificationData){
        toast.error(
        <div>
            <h3>Выход за границы допустимых значений!</h3>
            <p>{notificationData.text}</p>
            <NavButton navPath={`/sensors/pressure/${measurementData.imei}`} title='Перейти'></NavButton>
        </div>)
    }

    useEffect(()=>{
        facilitiesMetaInit()
    }, [])

    useEffect(()=>{
        console.log('alarmed sensors on mainapp:', alarmedSensors)
    }, [alarmedSensors])

    useEffect(()=>{
        console.log('update sensors on mainapp', sensors)
    }, [sensors])

    useEffect(()=>{
        async function getDisSensors() {
            const response = await getDisabledSensors()
            if(response.ok){
                setDisabledSensors(await response.json())
            }
        }
        getDisSensors()
    }, [selectedFacility])

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
                    connection.invoke("AddPressureClientToGroup", sensor.imei).catch((err)=>console.error("add to sensor group error", err))
                })
                connection.invoke("AddUserToUsersGroup").catch((err)=>console.error("add to users group error", err))
            }

            connection.on('ReciveMeasurements',(data:PressureMeasurements)=>{
                const updateSensors = [...sensors]
                setMeasurementsData(data, updateSensors)
                setSensors(updateSensors)
            })

            connection.on('ReciveAddSensorNotify', (data:PressureSensorDto)=>{
                setDisabledSensors(prev=>[...prev, data])
            })

            connection.on('ReciveAlarmNotify', (data:AlarmMeasurementsNotificationData)=>{
                addNotification(data.notificationData)
                showAlarmMeasurementNotification(data.measurementData, data.notificationData)
                alarmEvent(sensors, alarmedSensors, data.measurementData, setAlarmedSensors)
            })

            connection.on("ReciveForecastWarningNotify", (data:ForecastWarningNotificationData)=>{
                addNotification(data.notificationData)
                showDriftNotification(data.measurementData, data.notificationData)
            })
        }
        setConnection()

        return ()=>{
            connection.off('ReciveMeasurements')
            connection.off('ReciveAlarmNotify')
            connection.off('ReciveAddSensorNotify')
             connection.off("ReciveForecastWarningNotify")
            if(connection.state === 'Connected'){
                sensors.forEach(sensor=>connection.invoke('RemovePressureClientFromGroup', sensor.imei))
                connection.invoke("RemoveUserFromUsersGroup").catch((err)=>console.error("remove from users group error", err))
            }
        }
    },[sensors])

    useEffect(()=>{
        async function setAlarmedSensorsAsync() {
            const bufferAlarmedSensors:AlarmablePressureSensor[] = []
            for(const sensor of sensors){
                var response = await getUncheckedAlarmedMeasurements(sensor.imei)
                if(response.ok){
                    var uncheckedAlarmedMeasurements:PressureAlarmDto[] = await response.json()
                    if(uncheckedAlarmedMeasurements.length > 0){
                        sensor.isAlarmed = true
                        sensor.alarmedMeasurements = uncheckedAlarmedMeasurements
                        bufferAlarmedSensors.push(sensor)
                    }
                }
            }
            setAlarmedSensors(bufferAlarmedSensors)
        }
        setAlarmedSensorsAsync()

    }, [sensors])
    

    useEffect(()=>{
        console.log("Current facility:", selectedFacility)
    }, [selectedFacility])

    useEffect(()=>{
        console.log("sensors:", sensors)
    },[sensors])

    async function facilitiesMetaInit() {
        var response = await getFacilitiesDeppMeta()
        if(response.ok){
            setFacilitiesMeta(await response.json())
        }
    }

    function sensorOnDisalarm(sensor:AlarmablePressureSensor){
        sensor.isAlarmed = false
        setAlarmedSensors(prev=>[...prev.filter(s=>s.imei != sensor.imei)])
    }

    return (
        <div className='main-app-container'>
        <Router>
            <div className='header'>
                <div className='angle-header-element'><img src={logoImage} width="80px" height="80px"></img></div>
                <FacilitySelect 
                    facilitiesMeta={facilitiesMeta}
                    onSelectEvent={onFacilitySelect}
                    onClick={facilitiesMetaInit}
                />
                <Popup 
                    trigger={<button className='bordered-accent standart-button notification-menu-button'>
                        <img src={bellImage} width="32px" height="32px"></img>
                    </button>}
                    >
                        <div className='notifications-menu'>
                            <div className='bottom-border-main-color'>
                                <h3>Уведомления</h3>
                            </div>
                            {
                                notifications.map(n=>
                                <NotificationMenuElement createTime={n.createdDate}>
                                    <div>
                                        <p>{n.text}</p>
                                    </div>
                                </NotificationMenuElement>)
                            }
                            <button className='load-notifications-button' onClick={loadNotifications}>Ещё</button>
                        </div>
                    </Popup>
            </div>
           <div className='middle-part'>
                <div className='main-menu'>
                    <NavButton navPath='/monitor' image={sensorImage}/>
                    <NavButton navPath='/map' image={mapImage}/>
                    <NavButton navPath='/sensors-to-add' image={disabledSensorImage}/>
                    <NavButton navPath='/users' image={peopleImage}/>
                </div>
                <div className='page-window'>
                    <Routes>
                    <Route path='/login' element={<LoginPage/>}/>
                    <Route path='/sensors/pressure/:imei' element={
                        <PressureSensor sensors={sensors} sensorOnDisalarm={sensorOnDisalarm}
                            onDisableSensor={async ()=>{
                                const response = await getDisabledSensors()
                                if(response.ok){
                                    setDisabledSensors(await response.json())
                                }
                            }}
                        />}/>
                    <Route path='/users' element={<UsersPage facilitiesMetadata={facilitiesMeta}/>}/>
                    <Route path='/monitor' element={<GroupPage facility={selectedFacility} alarmedSensors={alarmedSensors} sensors={sensors} disabledSensors={disabledSensors} setFacility={setSelectedFacility}/>}/>
                    <Route path='/sensors-to-add' element={<SensorsToAddPage disabledSensors={disabledSensors} 
                    facilitiesMetadata={facilitiesMeta}
                    setDisabledSensors={setDisabledSensors}
                    onDeleteSensor={(sensor)=>{
                        if(selectedFacility){
                            selectedFacility.sections.forEach(section=>{
                                section.sensors = section.sensors.filter(s=>s.imei != sensor.imei)
                            })
                            selectedFacility.groups.forEach(group=>{
                                group.sensors = group.sensors.filter(s=>s.imei != sensor.imei)
                            })
                            setSelectedFacility({...selectedFacility})
                        }
                    }}/>}/>
                    <Route path='/map' element={<MapPage facility={selectedFacility} sensors={sensors} alarmedSenosrs={alarmedSensors}/>}/>
                </Routes>
                </div>
           </div>
            <ToastContainer
            position='bottom-right'
            autoClose={10000}
            limit={2}/>
        </Router>
        </div>
        
    )
}