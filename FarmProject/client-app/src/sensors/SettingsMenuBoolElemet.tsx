interface SettingsMenuBoolElementProps{
    title:string,
    value:boolean,
    changeEvent:React.ChangeEventHandler<HTMLInputElement>
}

export default function SettingsMenuBoolElemet({title, value, changeEvent}:SettingsMenuBoolElementProps){
    return (
        <div>
            <p>{title}</p> 
            {
                <input type="checkbox" checked={value} onChange={changeEvent}/>
            }
        </div>
    )
}