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
        connection.on("ReciveMeasurements",(message)=>{
            let data = JSON.parse(message)
            console.log(data)
            setMeasurement1(data.Measurement1)
            setMeasurement2(data.Measurement2)
        },[])

        return ()=>connection.off("ReciveMeasurements")
    })


    return (
        <Fragment>
            <h1>Imei:{imei}</h1>
            <button onClick={()=>navigate('/')}>Назад</button>
            <h2>M1:{measurement1}</h2>
            <h2>M2:{measurement2}</h2>
        </Fragment>
    )
}