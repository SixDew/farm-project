import { Fragment, useEffect, useState } from "react";
import './PressureSensor.css'
import { useNavigate, useParams } from "react-router-dom";
import connection from "./api/measurements-hub-connection";
import PressureMeasurementChart from "./PressureMeasurementChart";
import { getPressureSensorData } from './api/sensors-api'
import PressureSensorSettings from "./PressureSensorSettings";

export default function PressureSensor(){
    const navigate = useNavigate()
    const {imei} = useParams()
    const [measurementsData, setMeasurementsData] = useState()
    const [legacyMeasurements, setLegacyMeasurements] = useState([])
    const [showSettings, setShowSettings] = useState(false)

    useEffect(()=>{
        async function setConnection() {
            if(connection.state === 'Disconnected'){
                await connection.start()
                .then(()=>{console.log("StartConnection")})
                .catch((err)=>{console.error("Connection Error", err)})
            }

            if(connection.state === 'Connected'){
                connection.invoke("AddPressureClientToGroup", imei).catch((err)=>console.error("add to group error", err))
            }

            connection.on('ReciveMeasurements',(data)=>{
                console.log(Date.now(), data)
                setMeasurementsData(data)
            })
        }

        async function getSensorData() {
            getPressureSensorData(imei, ()=>{navigate('/login')})
            .then((data)=>setLegacyMeasurements(data.measurements))
        }

        getSensorData()
        setConnection()

        return ()=>{
            connection.off('ReciveMeasurements')
            if(connection.state === 'Connected'){
                connection.invoke('RemovePressureClientFromGroup', imei)
            }
        }
    },[imei])


    return (
        <Fragment>
            <div id='main-info-container'>
            <div id='base-info-container'>
            <button onClick={()=>navigate('/')} id="back-button">Назад</button>
            <h1>Imei:{imei}</h1>
            <h2>M1:{measurementsData?.measurement1}</h2>
            <h2>M2:{measurementsData?.measurement2}</h2>
            </div>
            
            <div id='settings-container'>
                <button id='show-settings' onClick={()=>setShowSettings((prev)=>!prev)}>Настройки</button>
                {showSettings? <PressureSensorSettings imei={imei} role={localStorage.getItem('role')}/> : null}
            </div>

            </div>

            <PressureMeasurementChart measurements={measurementsData} legacyMeasurements={legacyMeasurements}/>
        </Fragment>
    )
}