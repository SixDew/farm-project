import { useEffect, useState } from "react"
import { getDisabledSensors, getSectionsDeepMetadata } from "../sensors/api/sensors-api"
import DisabledSensors from "./DisabledSensor"

export default function SensorsToAddPage(){
    const [disabledSensors, setDisabledSensors] = useState([])
    const [sectionsMetadata, setSectionsMetadata] = useState([])

    useEffect(()=>{
        async function getSensors() {
            setDisabledSensors(await (await getDisabledSensors()).json())
        }
        getSensors()
    }, [])

    useEffect(()=>{
        async function getSections() {
            setSectionsMetadata(await (await getSectionsDeepMetadata()).json())
        }
        getSections()
    }, [])

    return (
        <div>
            {
                disabledSensors.map(s=><DisabledSensors imei={s.imei} gps={s.gps} sectionsMeta={sectionsMetadata} key={s.imei}/>)
            }
        </div>
    )
}