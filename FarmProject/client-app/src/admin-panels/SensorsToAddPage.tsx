import DisabledSensors from "./DisabledSensor"
import { FacilityDeepMetaDto, PressureSensorDto } from "../interfaces/DtoInterfaces"

interface SensorsToAddPageProps{
    disabledSensors:PressureSensorDto[],
    facilitiesMetadata:FacilityDeepMetaDto[],
    setDisabledSensors:React.Dispatch<React.SetStateAction<PressureSensorDto[]>>,
    onDeleteSensor?:(sensor:PressureSensorDto)=>void
}

export default function SensorsToAddPage({disabledSensors, facilitiesMetadata, setDisabledSensors, onDeleteSensor}:SensorsToAddPageProps){
    return (
        <div>
            {
                disabledSensors.map(s=><DisabledSensors imei={s.imei} 
                    gps={s.gps} 
                    facilitiesMeta={facilitiesMetadata} 
                    key={s.imei}
                    setDisabledSensors={setDisabledSensors}
                    onDeleteSensor={onDeleteSensor}
                    />)
            }
        </div>
    )
}