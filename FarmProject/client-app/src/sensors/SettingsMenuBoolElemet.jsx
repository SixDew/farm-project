export default function SettingsMenuBoolElemet({title, value, changeEvent}){
    return (
        <div>
            <p>{title}</p> 
            {
                <input type="checkbox" checked={value} onChange={changeEvent}/>
            }
        </div>
    )
}