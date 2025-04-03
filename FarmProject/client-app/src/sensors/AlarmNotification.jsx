import './AlarmNotification.css'

export default function AlarmNotification({measurement1, measurement2, date, onCheck}){
    return (
        <div onClick={onCheck}>
            <p>Измерение1: {measurement1}, Измерение2: {measurement2}, Дата: {new Date(date).toLocaleString()}</p>
        </div>
    )
}
