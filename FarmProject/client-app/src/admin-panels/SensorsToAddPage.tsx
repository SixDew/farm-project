import DisabledSensors from "./DisabledSensor"
import { FacilityDeepMetaDto, PressureSensorDto } from "../interfaces/DtoInterfaces"
import PageContentBase from "../PageContentBase"
import './SensorsToAddPage.css'

interface SensorsToAddPageProps{
    disabledSensors:PressureSensorDto[],
    facilitiesMetadata:FacilityDeepMetaDto[],
    setDisabledSensors:React.Dispatch<React.SetStateAction<PressureSensorDto[]>>,
    onDeleteSensor?:(sensor:PressureSensorDto)=>void
}

export default function SensorsToAddPage({disabledSensors, facilitiesMetadata, setDisabledSensors, onDeleteSensor}:SensorsToAddPageProps){
    return (
        <PageContentBase title="Отключенные датчики">
            <div className="disabled-sensors-table-conteiner">
                <table className="disabled-sensors-table">
                <thead>
                    <tr className="table-head">
                        <th>Номер</th>
                        <th>Координаты</th>
                        <th>Предприятие</th>
                        <th>Группы</th>
                        <th>Секция</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        disabledSensors.map(s=><DisabledSensors imei={s.imei} 
                        gps={s.gps} 
                        facilitiesMeta={facilitiesMetadata}
                        selectedFacilityId={s.facilityId} 
                        key={s.imei}
                        setDisabledSensors={setDisabledSensors}
                        onDeleteSensor={onDeleteSensor}
                        />)
                    }
                </tbody>
            </table>
            </div>
        </PageContentBase>
    )
}