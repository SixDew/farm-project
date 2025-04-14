interface SettingsMenuNumElementProps{
    title:string,
    value:number,
    changeEvent:React.ChangeEventHandler<HTMLInputElement>
}

export default function SettingsMenuNumElemet({title, value, changeEvent}:SettingsMenuNumElementProps){
    return (
        <div>
            <p>{title }</p> <input type="number" value={value} onChange={changeEvent}/>
        </div>
    )
}