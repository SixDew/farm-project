import { SensorGroupDto } from '../interfaces/DtoInterfaces'
import { addToGroup, addGroup } from '../sensors/api/sensors-api'
import './SectionElement.css'

interface SectionElementProps{
    name:string,
    groups:SensorGroupDto[],
    sectionId:number
}

export default function SectionElement({name, groups, sectionId}:SectionElementProps){
    console.log(sectionId)
    return(
        <div id='main-section-element'>
        <p>{name}</p>
        <div className='groups'>
            <p>Группы</p>
            {
                groups.map(g=><div className='group' key={g.id}>
                    <p>{g.metadata.name}</p>
                    <div className='group-sensors-container'>
                    <p>Сенсоры</p>
                    {
                        g.sensors.map(s=><div key={s.imei}>
                            <p>Imei:{s.imei}</p>
                        </div>)
                    }
                    </div>
                    <button onClick={()=>addToGroup(g.id, "1")}>Добавить сенсор</button>
                </div>)
            }
        </div>
        <button onClick={()=>addGroup("Группа 2", "Описание", sectionId)}>Добавить группу</button>
        </div>
    )
}