interface SettingsMenuNumElementProps{
    title:string,
    value:number,
    className?:string,
    changeEvent:React.ChangeEventHandler<HTMLInputElement>
}

export default function SettingsMenuNumElemet({title, value,className, changeEvent}:SettingsMenuNumElementProps){
    return (
        <div>
            <p>{title }</p> <input className={className} type="number" value={value} onChange={changeEvent}/>
        </div>
    )
}