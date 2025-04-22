import './GroupAccordingElement.css'

interface GroupAccordingElementProps{
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
            <div>{name}</div>
            <button onClick={(e)=>{
                e.stopPropagation()
                onChangeVisible && onChangeVisible(e)
            }}>{isVisible ? <>O</> : <>=</>}</button>
            {
                groupAlarmedSensorsCount > 0 && (<><span>!</span> <span>{groupAlarmedSensorsCount}/{groupSensorsCount}</span></>)
            }
        </div>
    )
}