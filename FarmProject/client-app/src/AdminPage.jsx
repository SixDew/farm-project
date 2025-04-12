import { useEffect, useRef, useState } from "react"
import "./AdminPage.css"
import { getUsers, createUser } from "./sensors/users-api"
import { useNavigate } from "react-router-dom"
import UserElement from "./UserElement"
import { addGroup, addToGroup, getGroups } from "./sensors/api/sensors-api"

export default function AdminPage(){
    const [users, setUsers] = useState()
    const [addMode, setAddMode] = useState(false)
    const nav = useNavigate()

    const passInput = useRef()
    const nameInput = useRef()
    const phoneInput = useRef()
    
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

    async function addUser() {
        const response = await createUser({
            Key:passInput.current.value,
            Name:nameInput.current.value,
            Phone:phoneInput.current.value,
            Role:"user"
        })
        if(response.ok){
            setAddMode(false)
            getUsersData()
        }
    }

    return (
        <div id="main-admin-container">
            <h1>Панель администратора</h1>
            <div id="users-container">
                {users && users.map((user, index)=><UserElement key={index} pass={user.key} name={user.name} phone={user.phone} role={user.role} userId={user.id}/>)}
            </div>
            {addMode ? <div>
                <input type="text" ref={passInput}></input>
                <input type="text" ref={nameInput}></input>
                <input type="text" ref={phoneInput}></input>
                <div>
                    <button onClick={addUser}>Сохранить</button>
                    <button onClick={()=>setAddMode(false)}>Отмена</button>
                </div>
            </div> : <button onClick={()=>setAddMode(true)}>Добавить оператора</button>}
            <button onClick={()=>nav("/")}>Мониторинг</button>
            <button onClick={()=>nav("/groups")}>Группы</button>
            <button onClick={()=>nav("/disabled")}>Датчики на добавление</button>
            <button onClick={()=>nav("/map")}>Карта</button>
        </div>
    )
}