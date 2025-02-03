import SensorMini from "./SensorMini.jsx"
import './SensorsMiniContainer.css'

export default function SensorsMiniContainer({sensors}){
    return (
        <div className="sensors-mini-container">
            {
            sensors.map((sensor)=> <SensorMini key={sensor.imei} imei={sensor.imei} gps={sensor.gps}></SensorMini>)
        }
        </div>
    )
}