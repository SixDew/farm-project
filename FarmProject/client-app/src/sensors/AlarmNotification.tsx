import './AlarmNotification.css'
interface AlarmNotificationProps {
    measurement1: number;
    measurement2: number;
    date: string;
    onCheck: () => void;
  }

export default function AlarmNotification({measurement1, measurement2, date, onCheck}:AlarmNotificationProps){
    return (
        <div className='alarm-notification' onClick={onCheck}>
            <p>Измерение1: {measurement1}</p>
            <p>Измерение2: {measurement2}</p>
            <p>Дата: {new Date(date).toLocaleString()}</p>
        </div>
    )
}
