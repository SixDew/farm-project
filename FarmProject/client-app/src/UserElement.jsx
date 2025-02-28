import { useRef, useState } from "react"
import "./UserElement.css"
import UserElementField from "./UserElementField"
import { updateUserData, removeUser } from "./sensors/users-api"

export default function UserElement({pass, name, phone, role, userId}){
    const [isReadonly, setIsReadonly] = useState(true)
    const [password, setPass] = useState(pass)
    const [userName, setName] = useState(name)
    const [phoneNum, setPhone] = useState(phone)
    const [isDeleted, setIsDeleted] = useState(false)

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
            Role:role,
            Id:userId
        })
        if(response.ok){
            setChanging(false)
            setIsReadonly(true)
        }
    }

    async function deleteUser() {
        const response = await removeUser(userId)
        if(response.ok){
            setIsDeleted(true)
        }
    }

    return(
        <>
        {
            !isDeleted && <div className="user-element">
            <label>Пароль <UserElementField type="text" value={password} isReadonly={isReadonly} onChange={(event)=>setPass(event.target.value)}/></label>
            <label>Имя <UserElementField type="text" value={userName} isReadonly={isReadonly} onChange={(event)=>setName(event.target.value)}/></label>
            <label>Телефон <UserElementField type="text" value={phoneNum} isReadonly={isReadonly} onChange={(event)=>setPhone(event.target.value)}/></label>
            {isChanging ? <div>
                <button onClick={saveUserData}>Сохранить</button>
                <button onClick={resetValues}>Отменить</button>
            </div> : <>
            <button onClick={()=>{
                setIsReadonly(false)
                setChanging(true)
            }}>Изменить</button>
            <button onClick={deleteUser}>Удалить</button>
            </>}
        </div>
        }
        </>
    )
}