import { useEffect, useRef, useState } from "react"
import "./UsersPage.css"
import { getUsers, createUser } from "../sensors/users-api"
import { useNavigate } from "react-router-dom"
import UserElement from "../UserElement"
import { AdminUserDto, FacilityDeepMetaDto } from "../interfaces/DtoInterfaces"
import CreateUserDialog from "./CreateUserDialog"
import PageContentBase from "../PageContentBase"

import plusImage from '../images/plus.png'

interface UserPageProps{
    facilitiesMetadata:FacilityDeepMetaDto[]
}

export default function UsersPage({facilitiesMetadata}:UserPageProps){
    const [users, setUsers] = useState<AdminUserDto[]>()
    const [addMode, setAddMode] = useState<boolean>(false)
    const nav = useNavigate()
    
    async function getUsersData(){
        const response = await getUsers()
        if(response.status === 401 || response.status == 403){
            nav('/login')
        }
        if(response.ok){
            setUsers(await response.json())
        }
    }

    useEffect(()=>{
        getUsersData()
    }, [])

    return (
        <PageContentBase title="Операторы">
            <div id="main-users-table-container">
            {
                addMode && <CreateUserDialog 
                    isOpen={addMode}
                    facilitiesMetadata={facilitiesMetadata} 
                    OnCreateUser={()=>{
                        getUsersData()
                    }}
                    OnEnd={()=>setAddMode(false)}
                />
            }
            {/* <div id="users-menu">
                <div id="users-container">{users && users.map((user, index)=><UserElement 
                    key={index} 
                    pass={user.key} 
                    name={user.name} 
                    contactData={user.contactData} 
                    role={user.role} 
                    userId={user.id}
                    userFacilityId={user.facilityId}
                    facilitiesMetadata={facilitiesMetadata}/>)}
                </div>
                <div><button onClick={()=>setAddMode(!addMode)}>Добавить оператора</button></div>
            </div> */}
            <table className="users-table">
                <thead>
                    <tr className="table-head">
                        <th>ФИО</th>
                        <th>Контактные данные</th>
                        <th>Предприятие</th>
                        <th>Ключ</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {users && users.map((user, index)=><UserElement 
                    key={index} 
                    pass={user.key} 
                    name={user.name} 
                    contactData={user.contactData} 
                    role={user.role} 
                    userId={user.id}
                    userFacilityId={user.facilityId}
                    facilitiesMetadata={facilitiesMetadata}/>)}
                </tbody>
            </table>
            <button className="standart-button bottom-left" onClick={()=>setAddMode(!addMode)}><img src={plusImage} width="48px" height="48px"></img></button>
        </div>
        </PageContentBase>
    )
}