import { FacilityDeepMetaDto } from "../interfaces/DtoInterfaces"
import "./FacilitySelect.css"

interface FacilitySelectProps{
    facilitiesMeta:FacilityDeepMetaDto[],
    onSelectEvent?:React.ChangeEventHandler<HTMLSelectElement>
    onClick?:(()=>void)|React.MouseEventHandler<HTMLSelectElement>
}

export default function FacilitySelect({facilitiesMeta, onSelectEvent, onClick}:FacilitySelectProps){
    return (
        <div className="facility-select-container">
            <select onClick={(e)=>{
                onClick && onClick(e)
            }} className="facility-select-element" onChange={onSelectEvent}>
                <option value={0} selected>-Выбрать предприятие-</option>
                {
                    facilitiesMeta.map(f=><option key={f.id} value={f.id}>{f.name}</option>)
                }
            </select>
        </div>
    )
}