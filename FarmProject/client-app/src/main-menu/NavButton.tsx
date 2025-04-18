import { useNavigate } from "react-router-dom"
import './NavButton.css'

interface NavButtonProps{
    navPath:string,
    title:string
}

export default function NavButton({navPath, title}:NavButtonProps){
    const nav = useNavigate()
    return(
        <div className="nav-button-container">
            <button 
            className="nav-button"
            onClick={()=>nav(navPath)}
            >
                {title}
            </button>
        </div>
    )
}