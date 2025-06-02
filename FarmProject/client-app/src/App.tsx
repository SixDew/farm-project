import './App.css'
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import PressureSensor from './sensors/PressureSensor'
import LoginPage from './LoginPage'
import UsersPage from './admin-panels/UsersPage'
import GroupPage from './admin-panels/group-page/GroupPage'
import SensorsToAddPage from './admin-panels/SensorsToAddPage'
import MapPage from './admin-panels/map-page/MapPage'
import { AlarmablePressureSensor, MeasurementsDriftData, FacilityDeepMetaDto, FacilityDto, NotificationData, PressureAlarmDto, PressureMeasurements, PressureSensorDto, ForecastWarningNotificationData, AlarmMeasurementsNotificationData, AddSensorNotificationData } from './interfaces/DtoInterfaces'
import { useEffect, useState } from 'react'
import {getDisabledSensors, getFacilitiesDeepMeta, getFacility, getNotifications, getUncheckedAlarmedMeasurements, getUserFacility } from './sensors/api/sensors-api'
import createConnection from "./sensors/api/measurements-hub-connection.js"
import NavButton from './main-menu/NavButton'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './AuthProvider'
import RequireAuth from './RequireAuth'
import AppAuthPagesLayout from './AppAuthPagesLayout'
import { HubConnection } from '@microsoft/signalr'

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
    const authContext = useAuth()
    const [facilitiesMeta, setFacilitiesMeta] = useState<FacilityDeepMetaDto[]>([])
    const [selectedFacility, setSelectedFacility] = useState<FacilityDto>()
    const [sensors, setSensors] = useState<AlarmablePressureSensor[]>([])
    const [alarmedSensors, setAlarmedSensors] = useState<AlarmablePressureSensor[]>([])
    const [disabledSensors, setDisabledSensors] = useState<PressureSensorDto[]>([])

    const [notifications, setNotifications] = useState<NotificationData[]>([])
    const [connection, setConnection] = useState<HubConnection | null>(null)

    useEffect(()=>{
        if(!authContext.token){
            return
        }
        setConnection(createConnection(authContext.token))
    }, [authContext.token])


    async function loadNotifications() {
        var userIdString:string | null = localStorage.getItem("userId")
        if(userIdString){
            var response = await authContext.sendWithAccessCheck(()=>getNotifications(Number.parseInt(userIdString!), notifications.length, notificationsLimit))
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
    }, [authContext.token])

    useEffect(()=>{
        async function getDisSensors() {
            const response = await authContext.sendWithAccessCheck(getDisabledSensors)
            if(response.ok){
                setDisabledSensors(await response.json())
            }
        }
        if(authContext.role == "admin"){
            getDisSensors()
        }
    }, [selectedFacility, authContext.role])

    async function onFacilitySelect(e:React.ChangeEvent<HTMLSelectElement>){
        const facilityId = Number(e.target.value)
        const response = await authContext.sendWithAccessCheck(()=>getFacility(facilityId))
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
            if(!connection){
                return
            }

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

            connection.on('ReciveAddSensorNotify', (data:AddSensorNotificationData)=>{
                addNotification(data.notificationData)
                setDisabledSensors(prev=>[...prev, data.sensorData])
                toast.warning(
                <div>
                    <h3>Новый датчик!</h3>
                    <p>{data.notificationData.text}</p>
                    <NavButton navPath={`/sensors-to-add`} title='Перейти'></NavButton>
                </div>)
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
            if(!connection){
                return
            }
            connection.off('ReciveMeasurements')
            connection.off('ReciveAlarmNotify')
            connection.off('ReciveAddSensorNotify')
             connection.off("ReciveForecastWarningNotify")
            if(connection.state === 'Connected'){
                sensors.forEach(sensor=>connection.invoke('RemovePressureClientFromGroup', sensor.imei))
                connection.invoke("RemoveUserFromUsersGroup").catch((err)=>console.error("remove from users group error", err))
            }
        }
    },[sensors, connection])

    useEffect(()=>{
        async function reconnect() {
            if(!connection){
                return
            }
            await connection.stop()
            await connection.start()
        }
        reconnect()
    }, [authContext])

    useEffect(()=>{
        async function setAlarmedSensorsAsync() {
            const bufferAlarmedSensors:AlarmablePressureSensor[] = []
            for(const sensor of sensors){
                var response = await authContext.sendWithAccessCheck(()=>getUncheckedAlarmedMeasurements(sensor.imei))
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
        if(authContext.role == "admin"){
            var response = await authContext.sendWithAccessCheck(getFacilitiesDeepMeta);
            setFacilitiesMeta(await response.json())
        }
        else{
            var response = await authContext.sendWithAccessCheck(()=>getUserFacility());
            setFacilitiesMeta([await response.json()])
        }
    }

    function sensorOnDisalarm(sensor:AlarmablePressureSensor){
        sensor.isAlarmed = false
        setAlarmedSensors(prev=>[...prev.filter(s=>s.imei != sensor.imei)])
    }

    return (
        <div className='main-app-container'>
                <Router>
                    <Routes>
                        <Route path='/login' element={<LoginPage/>}/>
                        <Route element={<RequireAuth>
                            <AppAuthPagesLayout 
                            facilitiesMeta={facilitiesMeta}
                            facilitiesMetaInit={facilitiesMetaInit}
                            loadNotifications={loadNotifications}
                            notifications={notifications}
                            onFacilitySelect={onFacilitySelect}
                            setSelectedFacility={setSelectedFacility}
                            /></RequireAuth>}>
                            <Route path='/sensors/pressure/:imei' element={
                            <PressureSensor sensors={sensors} sensorOnDisalarm={sensorOnDisalarm}
                                onDisableSensor={async ()=>{
                                    if(authContext.role == "admin"){
                                        const response = await authContext.sendWithAccessCheck(getDisabledSensors)
                                        if(response.ok){
                                            setDisabledSensors(await response.json())
                                        }
                                    }
                                }}
                            />}/>
                            <Route path='/monitor' element={<GroupPage facility={selectedFacility} alarmedSensors={alarmedSensors} sensors={sensors} disabledSensors={disabledSensors} setFacility={setSelectedFacility}/>}/>
                            <Route path='/map' element={<MapPage facility={selectedFacility} sensors={sensors} alarmedSenosrs={alarmedSensors}/>}/>
                            <Route element={<RequireAuth role="admin"/>}>
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
                                <Route path='/users' element={<UsersPage facilitiesMetadata={facilitiesMeta}/>}/>
                            </Route>
                        </Route>
                    </Routes>
                </Router>
        </div>
        
    )
}