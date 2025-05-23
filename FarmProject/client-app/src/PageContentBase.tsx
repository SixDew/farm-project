import { ReactNode } from "react";
import './main-style.css';

interface PageContentBaseProps{
    children?:ReactNode,
    title:string
}

export default function PageContentBase({children, title}:PageContentBaseProps){
    return(
        <div className="page-container">
            <h3 className="page-title">
                {title}
            </h3>
            <div className="page-content-container">
                {children}
            </div>
        </div>
    )
}