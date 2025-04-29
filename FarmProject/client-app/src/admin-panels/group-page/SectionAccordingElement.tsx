import { ReactElement } from "react"
import { GroupAccordingElementProps } from "./GroupAccordingElement"
import eyeimg from './images/eye.png';
import hidden from './images/hidden.png'

interface SectionAccordingElementProps{
    className?:string
    children?:ReactElement<GroupAccordingElementProps>[] | ReactElement<GroupAccordingElementProps>,
    sectionName:string,
    isVisible:boolean
    onPositionUp?:()=>void,
    onPositionDown?:()=>void,
    onClick?:React.MouseEventHandler<HTMLDivElement>,
    onChangeVisible?:React.MouseEventHandler<HTMLButtonElement>

}

export default function SectionAccordingElement({className, children, sectionName,isVisible, onPositionUp, onPositionDown, onChangeVisible, onClick}:SectionAccordingElementProps){
    return (
        <div className={className} onClick={onClick}>
            <span className='position-control'>
                <button className='position-button' onClick={(e)=>{
                    e.stopPropagation()
                    onPositionUp && onPositionUp()
                }}>⯅</button>
                <button className='position-button' onClick={(e)=>{
                    e.stopPropagation()
                    onPositionDown && onPositionDown()
                }}>⯆</button>
            </span>
            <div>{sectionName}</div>
            <div>{children}</div>
            <button onClick={(e)=>{
                e.stopPropagation()
                onChangeVisible && onChangeVisible(e)
            }}>{isVisible ? <><img src={eyeimg} width={'10px'} height={'10px'}></img></> : <img src={hidden} width={'10px'} height={'10px'}></img>}</button>
        </div>
    )
}