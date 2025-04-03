import { setSensorActive } from "../sensors/api/sensors-api";

export default function DisabledSensors({imei, gps}){
    return (
        <>
            <p>Imei:{imei}</p>
            <p>GPS:{gps}</p>
            <button onClick={()=>{setSensorActive(true, imei)}}>Активировать</button>
        </>
    )
}