import { useRef, useState } from "react"
import { login as sendLogin } from "./sensors/user-login"
import { useNavigate } from "react-router-dom"

export default function LoginPage(){
    const passInput = useRef(null)
    const navigate = useNavigate()
    const [unauthorizedError, setUnauthorizedError] = useState(false)

    function login(pass){
        sendLogin(pass)
        .then(response=>{
            if(response.status === 401){
                setUnauthorizedError(true)
            }
            if(response.ok){
                navigate('/')
            }
        })
    }

    return (
        <div>
            <input type="password" ref={passInput}></input>
            <button onClick={()=>login(passInput.current.value)}>Войти</button>
            {unauthorizedError && <p>Неверный ключ</p>}
        </div>
    )
}