import { useEffect, useState } from "react"
import { getDisabledSensors, getFacilitiesDeppMeta } from "../sensors/api/sensors-api"
import DisabledSensors from "./DisabledSensor"
import { FacilityDeepMetaDto, PressureSensorDto } from "../interfaces/DtoInterfaces"

export default function SensorsToAddPage(){
    const [disabledSensors, setDisabledSensors] = useState<PressureSensorDto[]>([])
    const [facilitiesMetadata, setFacilitiesMetadata] = useState<FacilityDeepMetaDto[]>([])

    useEffect(()=>{
        async function getSensors() {
            setDisabledSensors(await (await getDisabledSensors()).json())
        }
        getSensors()
    }, [])

    useEffect(()=>{
        async function getSections() {
            setFacilitiesMetadata(await (await getFacilitiesDeppMeta()).json())
        }
        getSections()
    }, [])

    return (
        <div>
            {
                disabledSensors.map(s=><DisabledSensors imei={s.imei} gps={s.gps} facilitiesMeta={facilitiesMetadata} key={s.imei}/>)
            }
        </div>
    )
}