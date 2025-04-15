import { PressureSensorDto } from "../../interfaces/DtoInterfaces";
import { addToGroup } from "../../sensors/api/sensors-api";
import "./GroupElement.css"

interface GroupElementProps{
    name:string,
    sensors:PressureSensorDto[]
}

export default function GroupElement({name, sensors}:GroupElementProps){
    return (
        <div>
            <h3>Группа: {name}</h3>
            {
                sensors.map(s=>{
                    return (
                        <div>
                            Imei: {s.imei}
                            gps: {s.gps}
                        </div>
                    )
                })
            }
            <button onClick={()=>addToGroup(1, "1")}>Добавить датчик</button>
        </div>
    )
}