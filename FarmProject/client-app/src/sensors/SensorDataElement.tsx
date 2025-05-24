import { ReactNode } from "react";
import './SensorDataElement.css';

interface SensorDataElementProps{
    children?:ReactNode,
    scrollable?:boolean
}

export default function SensorDataElement({children, scrollable}:SensorDataElementProps){
    return (
        <div className={`sensor-data-element${scrollable?' scrollable':''}`}>
            {children}
        </div>
    )
}