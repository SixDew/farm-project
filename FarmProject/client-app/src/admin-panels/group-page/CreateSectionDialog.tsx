import { useRef } from 'react'
import { SensorSectionDto } from '../../interfaces/DtoInterfaces'
import { addSection } from '../../sensors/api/sensors-api'
import './CreateSectionDialog.css'
import Dialog from './Dialog'
import { useAuth } from '../../AuthProvider'

interface CreateSectionDialogProps{
    isOpen:boolean,
    facilityId:number,
    onEnd?:()=>void,
    onSectionAdd?:(section:SensorSectionDto)=>void
}

export default function CreateSectionDialog({isOpen, facilityId, onEnd, onSectionAdd}:CreateSectionDialogProps){
    const sectionNameInput = useRef<HTMLInputElement>(null)
    const authContext = useAuth()

    async function createSection() {
        if(sectionNameInput && sectionNameInput.current){
            const response = await authContext.sendWithAccessCheck(()=>addSection(sectionNameInput!.current!.value, facilityId))
            if(response.ok){
                const section = await response.json()
                onSectionAdd && onSectionAdd(section)
            }
        }
    }

    return (
        <Dialog
            isOpen={isOpen}
            endButtonTitle='Принять'
            onEnd={()=>{
                createSection()
                onEnd && onEnd()
            }}
        >
            <div className="create-secion-dialog-container">
                <h4>Название</h4>
                <input className="section-name-input" ref={sectionNameInput} type="text"></input>
            </div>
        </Dialog>
    )
}