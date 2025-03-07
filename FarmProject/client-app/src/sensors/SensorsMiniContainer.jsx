import { useNavigate } from "react-router-dom"
import SensorMini from "./SensorMini.jsx"
import './SensorsMiniContainer.css'
import { Fragment, useEffect, useState } from "react"
import { getAlarmedMeasurements, getAllPressureSensors } from "./api/sensors-api.js"
import connection from "./api/measurements-hub-connection.js"

export default function SensorsMiniContainer(){
    const navigate = useNavigate()
    let [sensors, setSensors] = useState([])
    const [alarmedSensors, setAlarmedSensors] = useState([])
    
    useEffect(()=>{
        async function getSensors() {
            const response = await getAllPressureSensors()
            if(response.ok){
                const data = await response.json()
                setSensors(getSensorsFromServerData(data))
            }
            if(response.status === 401){
                navigate('/login')
            }
        }
        getSensors()
    },[])

    useEffect(()=>{
        async function getAlarmedMeasurementsAsync() {
            for(const sensor of sensors){
                var response = await getAlarmedMeasurements(sensor.imei)
                if(response.ok){
                    var alarmedMeasurementsList = await response.json()
                    for(const measurement of alarmedMeasurementsList){
                        if(!sensor.alarmedMeasurements.find(m=>m.id == measurement.id)){
                            if(!measurement.isChecked){
                                sensor.alarmedMeasurements.push(measurement)
                                addSensorToAlarm(sensor, alarmedSensors, setAlarmedSensors)
                            }
                        }
                    }
                }
            }
        }
        getAlarmedMeasurementsAsync()
    }, [sensors])

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

            connection.on('ReciveMeasurements',(data)=>{
                const updateSensors = [...sensors]
                setMeasurementsData(data, updateSensors)
                setSensors(updateSensors)
            })

            connection.on('ReciveAlarmNotify', (data)=>{
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
                    alarmedSensors.map(sensor=><SensorMini key={sensor.imei} imei={sensor.imei} gps={sensor.gps}
                         measurement1={sensor.measurement1} measurement2={sensor.measurement2} isAlarmed={sensor.isAlarmed}></SensorMini>)
                }
            </div>
            <div className="sensors-mini-container">
                {
                    sensors.map((sensor)=> <SensorMini key={sensor.imei} imei={sensor.imei} gps={sensor.gps}
                     measurement1={sensor.measurement1} measurement2={sensor.measurement2} isAlarmed={sensor.isAlarmed}></SensorMini>)
                }
        </div>
        </Fragment>
    )
}

function getSensorsFromServerData(data){
    return data.map(sensor=>{
        return {imei:sensor.imei, gps:sensor.gps, measurement1:0, measurement2:0, isAlarmed:false, alarmedMeasurements:[]}
    })
}

function setMeasurementsData(data, sensors){
    for(const sensor of sensors){
        if(sensor.imei == data.imei){
            sensor.measurement1 = data.measurement1
            sensor.measurement2 = data.measurement2
            break
        }
    }
}

function alarmEvent(sensors, alarmedSensors, data, setAlarmedSensors){
    const sensor = sensors.find(s=>s.imei == data.imei)
    if(sensor){
        sensor.alarmedMeasurements.push(data)
        addSensorToAlarm(sensor, alarmedSensors, setAlarmedSensors)
    }
}

function addSensorToAlarm(sensor, alarmedSensors, setAlarmedSensors){
    if(!alarmedSensors.find(s=>s.imei==sensor.imei)){
        sensor.isAlarmed = true
        alarmedSensors.push(sensor)
        setAlarmedSensors([...alarmedSensors])
    }
}