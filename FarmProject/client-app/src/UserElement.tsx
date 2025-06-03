import {useState } from "react"
import UserElementField from "./UserElementField"
import { updateUserData, removeUser } from "./sensors/users-api"
import { FacilityDeepMetaDto } from "./interfaces/DtoInterfaces"
import "./UserElement.css"

import cancelImage from './images/white-cancel.png';
import changeImage from './images/white-change.png';
import deleteImage from './images/trash.png';
import saveImage from './images/save.png';
import { useAuth } from "./AuthProvider"
import { toast } from "react-toastify"

interface UserElementProps{
    login:string,
    tabel:string,
    name:string,
    contactData:string,
    role:string,
    userId:number,
    userFacilityId:number,
    facilitiesMetadata:FacilityDeepMetaDto[]
}

export default function UserElement({login, tabel, name, contactData, role, userId, userFacilityId, facilitiesMetadata}:UserElementProps){
    const [isReadonly, setIsReadonly] = useState(true)
    const [loginData, setLogin] = useState(login)
    const [tabelData, setTabel] = useState(tabel)
    const [password, setPass] = useState("")
    const [userName, setName] = useState(name)
    const [contact, setContact] = useState(contactData)
    const [isDeleted, setIsDeleted] = useState(false)
    const [facilityId, setFacilityId] = useState(userFacilityId)
    const [passwordInputType, setPasswordInputType] = useState("password")
    const authContext = useAuth()

    const [isChanging, setChanging] = useState(false)

    function resetValues(){
        setPass("")
        setName(name)
        setTabel(tabel)
        setLogin(login)
        setContact(contactData)
        setChanging(false)
        setIsReadonly(true)
        setFacilityId(userFacilityId)
        setPasswordInputType("password")
    }

    async function saveUserData(){
        const response = await authContext.sendWithAccessCheck(()=>updateUserData({
            Key:password,
            Name:userName,
            PersonnelNumber:tabelData,
            Login:loginData,
            ContactData:contact,
            Role:role,
            Id:userId,
            FacilityId:facilityId
        }))
        if(response.ok){
            setChanging(false)
            setIsReadonly(true)
            setPasswordInputType("password")
            setPass("")
        }
        if(response.status == 400){
            toast.error(<div><h3>Ошибка при сохранении изменений</h3><p>Проверьте корректность данных</p></div>)
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
            !isDeleted &&
            <tr className="users-table-row">
                <td><UserElementField type="text" value={userName} isReadonly={isReadonly} onChange={(event)=>setName(event.target.value)}/></td>
                <td><UserElementField type="text" value={tabelData} isReadonly={isReadonly} onChange={(event)=>setTabel(event.target.value)}/></td>
                <td><UserElementField type="text" value={contact} isReadonly={isReadonly} onChange={(event)=>setContact(event.target.value)}/></td>
                <td>{
                    isChanging ? 
                    <select className="user-facility-select" onChange={(e)=>{setFacilityId(Number(e.target.value))}}>
                        {
                            facilitiesMetadata.map(fm=>{
                                return (
                                    <option value={fm.id} selected={fm.id == facilityId}>{fm.name}</option>
                                )
                            })
                        }
                    </select> : <p className="user-facility-name">{facilitiesMetadata.find(f=>f.id == facilityId)?.name}</p>
                }</td>
                <td><UserElementField type="text" value={loginData} isReadonly={isReadonly} onChange={(event)=>setLogin(event.target.value)}/></td>
                <td><UserElementField type={passwordInputType} value={password} isReadonly={isReadonly} onChange={(event)=>setPass(event.target.value)}/></td>
                <td>
                    <div className="row-buttons-container">
                        {isChanging ? 
                        <>
                                <button className="table-button" onClick={saveUserData}><img src={saveImage} width="32px" height="32px"></img></button>
                                <button className="table-button delete" onClick={resetValues}><img src={cancelImage} width="32px" height="32px"></img></button>
                            </> : <div>
                            <button className="table-button" onClick={()=>{
                                setIsReadonly(false)
                                setPasswordInputType("text")
                                setChanging(true)
                            }}><img src={changeImage} width="32px" height="32px"></img></button>
                            <button className="table-button delete" onClick={deleteUser}><img src={deleteImage} width="32px" height="32px"></img></button>
                        </div>}
                    </div>
                </td>
            </tr>
        }
        </>
    )
}