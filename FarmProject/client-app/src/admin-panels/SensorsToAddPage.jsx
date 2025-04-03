import { useEffect, useState } from "react"
import { getDisabledSensors } from "../sensors/api/sensors-api"
import DisabledSensors from "./DisabledSensor"

export default function SensorsToAddPage(){
    const [disabledSensors, setDisabledSensors] = useState([])

    useEffect(()=>{
        async function getSensors() {
            setDisabledSensors(await (await getDisabledSensors()).json())
        }
        getSensors()
    }, [])

    return (
        <div>
            {
                disabledSensors.map(s=><DisabledSensors imei={s.imei} gps={s.gps} key={s.imei}/>)
            }
        </div>
    )
}