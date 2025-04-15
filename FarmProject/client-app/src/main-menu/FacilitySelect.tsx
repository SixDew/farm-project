import { FacilityDeepMetaDto } from "../interfaces/DtoInterfaces"
import "./FacilitySelect.css"

interface FacilitySelectProps{
    facilitiesMeta:FacilityDeepMetaDto[],
    onSelectEvent?:React.ChangeEventHandler<HTMLSelectElement>
}

export default function FacilitySelect({facilitiesMeta, onSelectEvent}:FacilitySelectProps){
    return (
        <div className="facility-select-element">
            <select onChange={onSelectEvent}>
                <option value={0} selected>-Выбрать предприятие-</option>
                {
                    facilitiesMeta.map(f=><option key={f.id} value={f.id}>{f.name}</option>)
                }
            </select>
        </div>
    )
}