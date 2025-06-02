import { useEffect, useState } from "react"
import "./UsersPage.css"
import { getUsers } from "../sensors/users-api"
import UserElement from "../UserElement"
import { AdminUserDto, FacilityDeepMetaDto } from "../interfaces/DtoInterfaces"
import CreateUserDialog from "./CreateUserDialog"
import PageContentBase from "../PageContentBase"

import plusImage from '../images/plus.png'
import { useAuth } from "../AuthProvider"

interface UserPageProps{
    facilitiesMetadata:FacilityDeepMetaDto[]
}

export default function UsersPage({facilitiesMetadata}:UserPageProps){
    const [users, setUsers] = useState<AdminUserDto[]>([])
    const [addMode, setAddMode] = useState<boolean>(false)
    const authContext = useAuth()
    
    async function getUsersData(){
        const response = await authContext.sendWithAccessCheck(getUsers)
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
            <table className="users-table">
                <thead>
                    <tr className="table-head">
                        <th>ФИО</th>
                        <th>Табель</th>
                        <th>Контактные данные</th>
                        <th>Предприятие</th>
                        <th>Логин</th>
                        <th>Ключ</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index)=><UserElement 
                    key={index}
                    tabel={user.personnelNumber} 
                    login={user.login} 
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