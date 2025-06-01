import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./LoginPage.css"
import { useAuth } from "./AuthProvider"
import './main-style.css'

export default function LoginPage(){
    const authContext = useAuth()
    const passInput = useRef<HTMLInputElement>(null)
    const loginInput = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()
    const [unauthorizedError, setUnauthorizedError] = useState(false)
    const [validationError, setValidationError] = useState(false)

    function login(pass:string|undefined, login:string|undefined){
        if(pass && login){
            setValidationError(false)
            authContext.login(pass, login, false)
            .then(()=>{
                navigate("/monitor")
            })
            .catch(()=>{
                setUnauthorizedError(true)
            })
        }
        else{
            setValidationError(true)
        }
    }

    function adminLogin(pass:string|undefined, login:string|undefined){
        if(pass && login){
            setValidationError(false)
            authContext.login(pass, login, true)
            .then(()=>{
                navigate("/monitor")
            })
            .catch(()=>{
                setUnauthorizedError(true)
            })
        }
        else{
            setValidationError(true)
        }
    }

    return (
        <div className="login-main-container">
            <h1>Для получения доступа введите логин и пароль</h1>
            <input className="login-input" type="text" ref={loginInput} required></input>
            <input className="key-input" type="password" ref={passInput} required></input>
            <button className="standart-button bordered-accent" onClick={()=>login(passInput?.current?.value, loginInput?.current?.value)}>Войти</button>
            <button className="standart-button bordered-accent" onClick={()=>adminLogin(passInput?.current?.value, loginInput?.current?.value)}>Войти как администратор</button>
            {unauthorizedError && <p className="login-error-message">Неверный логин или пароль</p>}
            {validationError && <p className="login-error-message">Заполните все поля</p>}
        </div>
    )
}