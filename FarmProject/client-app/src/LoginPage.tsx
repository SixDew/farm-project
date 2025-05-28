import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./LoginPage.css"
import { useAuth } from "./AuthProvider"
import './main-style.css'

export default function LoginPage(){
    const authContext = useAuth()
    const passInput = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()
    const [unauthorizedError, setUnauthorizedError] = useState(false)

    function login(pass:string|undefined){
        if(pass){
            authContext.login(pass, false)
            .then(()=>{
                navigate("/monitor")
            })
            .catch(()=>{
                setUnauthorizedError(true)
            })
        }
    }

    function adminLogin(pass:string|undefined){
        if(pass){
            authContext.login(pass, true)
            .then(()=>{
                navigate("/monitor")
            })
            .catch(()=>{
                setUnauthorizedError(true)
            })
        }
    }

    return (
        <div className="login-main-container">
            <h1>Для получения доступа введите ключ</h1>
            <input className="key-input" type="password" ref={passInput}></input>
            <button className="standart-button bordered-accent" onClick={()=>login(passInput?.current?.value)}>Войти</button>
            <button className="standart-button bordered-accent" onClick={()=>adminLogin(passInput?.current?.value)}>Войти как администратор</button>
            {unauthorizedError && <p>Неверный ключ</p>}
        </div>
    )
}