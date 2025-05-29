import { FacilityDeepMetaDto } from "../interfaces/DtoInterfaces"
import "./FacilitySelect.css"
import '../main-style.css'

interface FacilitySelectProps{
    facilitiesMeta:FacilityDeepMetaDto[],
    onSelectEvent?:React.ChangeEventHandler<HTMLSelectElement>
    onClick?:(()=>void)|React.MouseEventHandler<HTMLSelectElement>
}

export default function FacilitySelect({facilitiesMeta, onSelectEvent, onClick}:FacilitySelectProps){
    return (
        <div className="facility-select-container">
            <select className="bordered-accent accent-select" onClick={(e)=>{
                onClick && onClick(e)
            }} onChange={onSelectEvent}>
                <option value={undefined} selected>-Выбрать предприятие-</option>
                {
                    facilitiesMeta.map(f=><option key={f.id} value={f.id}>{f.name}</option>)
                }
            </select>
        </div>
    )
}