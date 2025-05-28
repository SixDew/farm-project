import { useRef } from "react"
import Dialog from "./Dialog"
import { addGroup } from "../../sensors/api/sensors-api"
import {  SensorGroupDto } from "../../interfaces/DtoInterfaces"

import './CreateGroupDialog.css'
import { useAuth } from "../../AuthProvider"

interface CreateGroupDialogProps{
    isOpen:boolean,
    facilityId:number
    OnEnd?:()=>void
    onGroupAdd?:(group:SensorGroupDto)=>void
}

export default function CreateGroupDialog({isOpen, OnEnd: OnEnd, facilityId, onGroupAdd}:CreateGroupDialogProps){
    const authContext = useAuth()
    const groupNameInput = useRef<HTMLInputElement>(null)

    async function createGroup() {
        if(groupNameInput && groupNameInput.current){
            var response = await authContext.sendWithAccessCheck(()=>addGroup(facilityId, groupNameInput!.current!.value))
            if(response.ok){
                onGroupAdd && onGroupAdd(await response.json())
            }
        }
    }

    return (
        <Dialog endButtonTitle="Принять"
            isOpen={isOpen}
            onEnd={()=>{
                createGroup()
                OnEnd && OnEnd()
            }}
            >
            <div className="create-group-dialog-container">
                <h4>Название</h4>
                <input className="group-name-input" ref={groupNameInput} type="text"></input>
            </div>
        </Dialog>
    )
}