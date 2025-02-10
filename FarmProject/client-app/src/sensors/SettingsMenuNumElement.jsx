export default function SettingsMenuNumElemet({title, value, changeEvent}){
    return (
        <div>
            <p>{title }</p> <input type="number" value={value} onChange={changeEvent}/>
        </div>
    )
}