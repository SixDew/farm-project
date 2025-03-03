import './AlarmNotification.css'

export default function AlarmNotification({measurement1, measurement2, date}){
    return (
        <div>
            <p>Измерение1: {measurement1}, Измерение2: {measurement2}, Дата: {date}</p>
        </div>
    )
}