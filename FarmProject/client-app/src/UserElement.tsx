import {useState } from "react"
import UserElementField from "./UserElementField"
import { updateUserData, removeUser } from "./sensors/users-api"
import { FacilityDeepMetaDto } from "./interfaces/DtoInterfaces"
import "./UserElement.css"

import cancelImage from './images/white-cancel.png';
import changeImage from './images/white-change.png';
import deleteImage from './images/trash.png';
import saveImage from './images/save.png';

interface UserElementProps{
    pass:string,
    name:string,
    contactData:string,
    role:string,
    userId:number,
    userFacilityId:number,
    facilitiesMetadata:FacilityDeepMetaDto[]
}

export default function UserElement({pass, name, contactData, role, userId, userFacilityId, facilitiesMetadata}:UserElementProps){
    const [isReadonly, setIsReadonly] = useState(true)
    const [password, setPass] = useState(pass)
    const [userName, setName] = useState(name)
    const [contact, setContact] = useState(contactData)
    const [isDeleted, setIsDeleted] = useState(false)
    const [facilityId, setFacilityId] = useState(userFacilityId)
    const [passwordInputType, setPasswordInputType] = useState("password")

    const [isChanging, setChanging] = useState(false)

    function resetValues(){
        setPass(pass)
        setName(name)
        setContact(contactData)
        setChanging(false)
        setIsReadonly(true)
        setFacilityId(userFacilityId)
        setPasswordInputType("password")
    }

    async function saveUserData(){
        const response = await updateUserData({
            Key:password,
            Name:userName,
            ContactData:contact,
            Role:role,
            Id:userId,
            FacilityId:facilityId
        })
        if(response.ok){
            setChanging(false)
            setIsReadonly(true)
            setPasswordInputType("password")
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
        {/* {
            !isDeleted && <div className="user-element">
            <p>Ключ</p><UserElementField type={passwordInputType} value={password} isReadonly={isReadonly} onChange={(event)=>setPass(event.target.value)}/>
            <p>ФИО</p><UserElementField type="text" value={userName} isReadonly={isReadonly} onChange={(event)=>setName(event.target.value)}/>
            <p>Контактные данные</p> <UserElementField type="text" value={contact} isReadonly={isReadonly} onChange={(event)=>setContact(event.target.value)}/>
            <p>Предприятие</p> 
            {
                isChanging ? 
                <select onChange={(e)=>{setFacilityId(Number(e.target.value))}}>
                    {
                        facilitiesMetadata.map(fm=>{
                            return (
                                <option value={fm.id} selected={fm.id == facilityId}>{fm.name}</option>
                            )
                        })
                    }
                </select> : <p className="user-facility-name">{facilitiesMetadata.find(f=>f.id == facilityId)?.name}</p>
            }
            {isChanging ? <div>
                <button onClick={saveUserData}>Сохранить</button>
                <button onClick={resetValues}>Отменить</button>
            </div> : <div>
            <button onClick={()=>{
                setIsReadonly(false)
                setPasswordInputType("text")
                setChanging(true)
            }}>Изменить</button>
            <button onClick={deleteUser}>Удалить</button>
            </div>}
        </div>
        } */}
        {
            !isDeleted &&
            <tr className="users-table-row">
                <td><UserElementField type="text" value={userName} isReadonly={isReadonly} onChange={(event)=>setName(event.target.value)}/></td>
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
                <td><UserElementField type={passwordInputType} value={password} isReadonly={isReadonly} onChange={(event)=>setPass(event.target.value)}/></td>
                <td>
                    <div className="row-buttons-container">
                        {isChanging ? 
                        <>
                                <button className="table-button" onClick={saveUserData}><img src={saveImage} width="32px" height="32px"></img></button>
                                <button className="table-button" onClick={resetValues}><img src={cancelImage} width="32px" height="32px"></img></button>
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