import { useRef } from "react"
import Dialog from "./group-page/Dialog"
import "./CreateUserDialog.css"
import { createUser } from "../sensors/users-api"
import { FacilityDeepMetaDto } from "../interfaces/DtoInterfaces"
import { useAuth } from "../AuthProvider"

interface CreateUserDialogProps{
    isOpen:boolean,
    facilitiesMetadata:FacilityDeepMetaDto[],
    OnEnd?:()=>void,
    OnCreateUser?:()=>void
}

export default function CreateUserDialog({isOpen, facilitiesMetadata, OnEnd, OnCreateUser}:CreateUserDialogProps){
    const passInput = useRef<HTMLInputElement>(null)
    const nameInput = useRef<HTMLInputElement>(null)
    const phoneInput = useRef<HTMLInputElement>(null)
    const facilityInput = useRef<HTMLSelectElement>(null)
    const authContext = useAuth()


        async function addUser() {
            const response = await authContext.sendWithAccessCheck(()=>createUser({
                Key:passInput?.current?.value,
                Name:nameInput?.current?.value,
                ContactData:phoneInput?.current?.value,
                Role:"user",
                FacilityId:facilityInput?.current?.value
            }))
            if(response.ok){
                OnCreateUser && OnCreateUser()
            }
        }
    
    return (
        <Dialog
            isOpen={isOpen}
            endButtonTitle="Принять"
            onEnd={async ()=>{
                await addUser()
                OnEnd && OnEnd()
            }}
        >
            <div className="create-user-dialog-container">
                <div>
                    <p>Ключ</p>
                    <input type="text" ref={passInput}></input>
                    <p>ФИО</p>
                    <input type="text" ref={nameInput}></input>
                    <p>Контактные данные</p>
                    <input type="text" ref={phoneInput}></input>
                    <p>Предприятие</p>
                    <select ref={facilityInput}>
                        {
                            facilitiesMetadata.map(fm=><option value={fm.id}>{fm.name}</option>)
                        }
                    </select>
                </div>
            </div>
        </Dialog>
    )
}