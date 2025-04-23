import { ReactElement } from "react"
import { GroupAccordingElementProps } from "./GroupAccordingElement"

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

export default function SectionAccordingElement({className, children, sectionName,isVisible, onPositionUp, onPositionDown, onChangeVisible}:SectionAccordingElementProps){
    return (
        <div className={className}>
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
            }}>{isVisible ? <>O</> : <>=</>}</button>
        </div>
    )
}