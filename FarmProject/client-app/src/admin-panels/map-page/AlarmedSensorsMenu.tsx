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
            {
                alarmedSensors && alarmedSensors.length > 0 && 
                <div className="alarmed-sensors-menu">
                <h2>Аварийные датчики</h2>
                {
                    alarmedSensors?.map(sensor=>{
                        return (
                            <button key={'alarmed-sensor'+sensor.imei} className="alarmed-sensor-element" onClick={()=>onAlarmedSensorSelect && onAlarmedSensorSelect(sensor)}>
                                <h5>Сенсор: {sensor.imei}</h5>
                                <h5>Координаты: {sensor.gps}</h5>
                            </button>
                        )
                    })
                }
            </div>
            }
        </Control>
    )
}