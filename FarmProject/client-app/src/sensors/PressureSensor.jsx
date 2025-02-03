import { Fragment } from "react";
import './PressureSensor.css'
import { useNavigate, useParams } from "react-router-dom";

export default function PressureSensor(){
    const navigate = useNavigate()
    const {imei} = useParams()

    return (
        <Fragment>
            <h1>Imei:{imei}</h1>
            <button onClick={()=>navigate('/')}>Назад</button>
        </Fragment>
    )
}