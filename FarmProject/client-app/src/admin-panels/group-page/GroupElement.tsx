import { PressureSensorDto } from "../../interfaces/DtoInterfaces";
import { addToGroup } from "../../sensors/api/sensors-api";
import "./GroupElement.css"

interface GroupElementProps{
    name:string,
    sensors:PressureSensorDto[]
}

export default function GroupElement({name, sensors}:GroupElementProps){
    return (
        <div className="group-info-element">
            <h3>Группа: {name}</h3>
            {
                sensors.map(s=>{
                    return (
                        <div className="sensor-info-element">
                            <p>Imei: {s.imei}</p>
                            <p>gps: {s.gps}</p>
                        </div>
                    )
                })
            }
            <button onClick={()=>addToGroup(1, "1")}>Добавить датчик</button>
        </div>
    )
}