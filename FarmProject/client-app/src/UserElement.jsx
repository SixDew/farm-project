import { useRef, useState } from "react"
import "./UserElement.css"
import UserElementField from "./UserElementField"
import { updateUserData } from "./sensors/users-api"

export default function UserElement({pass, name, phone, role}){
    const [isReadonly, setIsReadonly] = useState(true)
    const [password, setPass] = useState(pass)
    const [userName, setName] = useState(name)
    const [phoneNum, setPhone] = useState(phone)

    const [isChanging, setChanging] = useState(false)

    function resetValues(){
        setPass(pass)
        setName(name)
        setPhone(phone)
        setChanging(false)
        setIsReadonly(true)
    }

    async function saveUserData(){
        const response = await updateUserData({
            Key:password,
            Name:userName,
            Phone:phoneNum,
            Role:role
        })
        if(response.ok){
            setChanging(false)
            setIsReadonly(true)
        }
    }

    return(
        <div className="user-element">
            <UserElementField type="text" value={password} isReadonly={isReadonly} onChange={(event)=>setPass(event.target.value)}/>
            <UserElementField type="text" value={userName} isReadonly={isReadonly} onChange={(event)=>setName(event.target.value)}/>
            <UserElementField type="text" value={phoneNum} isReadonly={isReadonly} onChange={(event)=>setPhone(event.target.value)}/>
            {isChanging ? <div>
                <button onClick={saveUserData}>Сохранить</button>
                <button onClick={resetValues}>Отменить</button>
            </div> : <button onClick={()=>{
                setIsReadonly(false)
                setChanging(true)
            }}>Изменить</button>}
        </div>
    )
}