import './GroupAccordingElement.css'
import eyeimg from './images/eye-white.png';
import hidden from './images/hidden-white.png'
import '../../main-style.css'


export interface GroupAccordingElementProps{
    name:string,
    groupSensorsCount:number,
    groupAlarmedSensorsCount:number,
    className?:string,
    isVisible:boolean,
    onClick?:React.MouseEventHandler<HTMLDivElement>,
    onChangeVisible?:React.MouseEventHandler<HTMLButtonElement>
    onPositionUp?:()=>void
    onPositionDown?:()=>void
}

export default function GroupAccordingElement({name, groupSensorsCount,
     groupAlarmedSensorsCount, className, isVisible,
      onClick, onChangeVisible, onPositionUp, onPositionDown}:GroupAccordingElementProps){

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
            <div className='element-name'>{name}</div>
            <button className='bordered-accent visible-button' onClick={(e)=>{
                e.stopPropagation()
                onChangeVisible && onChangeVisible(e)
            }}>{isVisible ? <><img src={eyeimg} width={'10px'} height={'10px'}></img></> : <img src={hidden} width={'10px'} height={'10px'}></img>}</button>
            {
                groupAlarmedSensorsCount > 0 && (<span className='alarm-counter'><span>!</span> <span>{groupAlarmedSensorsCount}/{groupSensorsCount}</span></span>)
            }
        </div>
    )
}