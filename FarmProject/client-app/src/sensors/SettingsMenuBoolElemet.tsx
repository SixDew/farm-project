interface SettingsMenuBoolElementProps{
    title:string,
    value:boolean,
    className?:string,
    changeEvent:React.ChangeEventHandler<HTMLInputElement>
}

export default function SettingsMenuBoolElemet({title, value,className, changeEvent}:SettingsMenuBoolElementProps){
    return (
        <div>
            <p>{title}</p> 
            {
                <input className={className} type="checkbox" checked={value} onChange={changeEvent}/>
            }
        </div>
    )
}