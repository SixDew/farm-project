import { useRef, useState } from "react"
import { login as sendLogin, adminLogin as sendAdminLogin } from "./sensors/users-api"
import { useNavigate } from "react-router-dom"
import "./LoginPage.css"

export default function LoginPage(){
    const passInput = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()
    const [unauthorizedError, setUnauthorizedError] = useState(false)

    function login(pass:string|undefined){
        if(pass){
            sendLogin(pass)
            .then(async response=>{
                responseHandle(response, 'user')
            })
        }
    }

    function adminLogin(pass:string|undefined){
        if(pass){
            sendAdminLogin(pass)
            .then(async response=>{
                responseHandle(response, 'admin', '/admin')
            })
        }
    }

    async function responseHandle(response:Response, role:string, nav?:string) {
        if(response.status === 401){
            setUnauthorizedError(true)
        }
        if(response.ok){
            localStorage.setItem('role', role)
            const key = await response.text()
            localStorage.setItem('userKey', key)
            if(nav){
                navigate(nav)
                return
            }
            if(window.history.length > 0){
                navigate(-1)
            }
            else{
                navigate('/')
            }
        }
    }

    return (
        <div id="login-main-container">
            <input type="password" ref={passInput}></input>
            <button onClick={()=>login(passInput?.current?.value)}>Войти</button>
            <button onClick={()=>adminLogin(passInput?.current?.value)}>Войти как администратор</button>
            {unauthorizedError && <p>Неверный ключ</p>}
        </div>
    )
}