import { useNavigate } from "react-router-dom"
import './NavButton.css'

interface NavButtonProps{
    navPath:string,
    title?:string,
    image?:string,
    isActive?:boolean
}

export default function NavButton({navPath, title, image, isActive}:NavButtonProps){
    const nav = useNavigate()
    return(
        <div className="nav-button-container">
            <button 
            className='nav-button'
            onClick={()=>nav(navPath)}
            >
                {
                    image && <img src={image} width='50px' height='50px'></img>
                }
                {title}
            </button>
        </div>
    )
}