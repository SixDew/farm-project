import { PressureAlarmDto } from "../interfaces/DtoInterfaces"
import AlarmNotification from "./AlarmNotification"
import './AlarmNotificationsInfo.css'

import niceImage from '../images/nice.png'

interface AlarmNotificationsInfoProps{
    alarmedMeasurements:PressureAlarmDto[],
    onNotificationCheck?:(id:number)=>void
}

export default function AlarmNotificationsInfo({alarmedMeasurements,onNotificationCheck}:AlarmNotificationsInfoProps){
    return (
        <>
            {
                alarmedMeasurements.length > 0 ?
                <div className="notifications-info-container">
                    <h3>Предупреждения</h3>
                    {alarmedMeasurements.map((n, index)=><AlarmNotification measurement1={n.measurement1} measurement2={n.measurement2} date={n.measurementsTime} key={index}
                    onCheck={()=>{
                        onNotificationCheck && onNotificationCheck(n.id)
                    }}/>)}
                </div>:
                <div className="empty-alarm-info-container">
                    <h3>Аварийных измерений не обнаружено</h3>
                    <img src={niceImage} width="64px" height="64px"></img>
                </div>
            }
        </>
    )
}