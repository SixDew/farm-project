import { Fragment, useEffect, useState } from "react";
import './PressureSensor.css'
import { useNavigate, useParams } from "react-router-dom";
import connection from "./api/measurements-hub-connection";

export default function PressureSensor(){
    const navigate = useNavigate()
    const {imei} = useParams()
    const [measurement1, setMeasurement1] = useState()
    const [measurement2, setMeasurement2] = useState()

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
                setMeasurement1(data.measurement1)
                setMeasurement2(data.measurement2)
            })
        }

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
            <h1>Imei:{imei}</h1>
            <button onClick={()=>navigate('/')}>Назад</button>
            <h2>M1:{measurement1}</h2>
            <h2>M2:{measurement2}</h2>
        </Fragment>
    )
}