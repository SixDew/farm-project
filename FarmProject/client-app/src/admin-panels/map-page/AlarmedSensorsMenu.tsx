import Control from "react-leaflet-custom-control";
import { AlarmablePressureSensor } from "../../interfaces/DtoInterfaces";
import "./AlarmedSensorsMenu.css"

interface AlarmedSensorsMenuProps{
    alarmedSensors?:AlarmablePressureSensor[],
    onAlarmedSensorSelect?:(sensor:AlarmablePressureSensor)=>void
}

export default function AlarmedSensorsMenu({alarmedSensors, onAlarmedSensorSelect}:AlarmedSensorsMenuProps){
    console.log('alarmed:', alarmedSensors)
    return (
        <Control prepend position="topleft">
            <div className="alarmed-sensors-menu">
                <h3>Проблемы</h3>
                {
                    alarmedSensors?.map(sensor=>{
                        return (
                            <button onClick={()=>onAlarmedSensorSelect && onAlarmedSensorSelect(sensor)}>
                                <h5>Сенсор: {sensor.imei}</h5>
                                <h5>Координаты: {sensor.gps}</h5>
                            </button>
                        )
                    })
                }
            </div>
        </Control>
    )
}