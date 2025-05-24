import { PressureAlarmDto } from "../interfaces/DtoInterfaces"
import AlarmNotification from "./AlarmNotification"
import './AlarmNotificationsInfo.css'

interface AlarmNotificationsInfoProps{
    alarmedMeasurements:PressureAlarmDto[],
    onNotificationCheck?:(id:number)=>void
}

export default function AlarmNotificationsInfo({alarmedMeasurements,onNotificationCheck}:AlarmNotificationsInfoProps){
    return (
        <div className="notifucations-info-container">
            <h3>Предупреждения</h3>
            {alarmedMeasurements.map((n, index)=><AlarmNotification measurement1={n.measurement1} measurement2={n.measurement2} date={n.measurementsTime} key={index}
            onCheck={()=>{
                onNotificationCheck && onNotificationCheck(n.id)
            }}/>)}
        </div>
    )
}