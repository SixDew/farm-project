import { ReactNode, useEffect, useRef } from 'react'
import './EditGroupDialog.css'
import '../../main-style.css'

interface DialogProps{
    children?:ReactNode
    isOpen:boolean
    endButtonTitle:string
    onEnd?:()=>void
}

export default function Dialog({isOpen, children,endButtonTitle , onEnd}:DialogProps){
    const addSensorDialog = useRef<HTMLDialogElement>(null)

    useEffect(()=>{
        if(addSensorDialog && addSensorDialog.current){
            if(isOpen){
                addSensorDialog.current.showModal()
            }   
            else{
                addSensorDialog.current.close()
            }
        }
    }, [isOpen])
    return (
        <dialog ref={addSensorDialog} className="add-sensor-dialog">
            {children}
            <button className="standart-button" onClick={()=>{
                onEnd && onEnd()
            }}>{endButtonTitle}</button>
        </dialog>
    )
}