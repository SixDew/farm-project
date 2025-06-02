import { useRef } from "react"
import Dialog from "./group-page/Dialog"
import "./CreateUserDialog.css"
import { createUser } from "../sensors/users-api"
import { FacilityDeepMetaDto } from "../interfaces/DtoInterfaces"
import { useAuth } from "../AuthProvider"
import { toast } from "react-toastify"
import '../main-style.css'

interface CreateUserDialogProps{
    isOpen:boolean,
    facilitiesMetadata:FacilityDeepMetaDto[],
    OnEnd?:()=>void,
    OnCreateUser?:()=>void
}

export default function CreateUserDialog({isOpen, facilitiesMetadata, OnEnd, OnCreateUser}:CreateUserDialogProps){
    const passInput = useRef<HTMLInputElement>(null)
    const nameInput = useRef<HTMLInputElement>(null)
    const personnelNumberInput = useRef<HTMLInputElement>(null)
    const loginInput = useRef<HTMLInputElement>(null)
    const phoneInput = useRef<HTMLInputElement>(null)
    const facilityInput = useRef<HTMLSelectElement>(null)
    const authContext = useAuth()


        async function addUser():Promise<boolean> {
            const response = await authContext.sendWithAccessCheck(()=>createUser({
                Key:passInput?.current?.value,
                Name:nameInput?.current?.value,
                PersonnelNumber:personnelNumberInput?.current?.value,
                Login:loginInput?.current?.value,
                ContactData:phoneInput?.current?.value,
                Role:"user",
                FacilityId:facilityInput?.current?.value
            }))
            if(response.ok){
                OnCreateUser && OnCreateUser()
                return true
            }
            return false
        }
    
    return (
        <Dialog
            isOpen={isOpen}
            endButtonTitle="Принять"
            onEnd={async ()=>{
                var result = await addUser()
                if(result) OnEnd && OnEnd()
                else{
                    toast.error(<div><h3>Ошибка при сохранении пользователя</h3><p>Проверьте корректность данных</p></div>)
                }
            }}
        >
            <div className="create-user-dialog-container">
                <div className="bottom-border-main-color">
                    <p>Ключ</p>
                    <input type="text" ref={passInput}></input>
                </div>
                <div className="bottom-border-main-color">
                    <p>Логин</p>
                    <input type="text" ref={loginInput}></input>
                </div>
                <div className="bottom-border-main-color">
                    <p>ФИО</p>
                    <input type="text" ref={nameInput}></input>
                </div>
                <div className="bottom-border-main-color">
                    <p>Табель</p>
                    <input type="text" ref={personnelNumberInput}></input>
                </div>
                <div className="bottom-border-main-color">
                    <p>Контактные данные</p>
                    <input type="text" ref={phoneInput}></input>
                </div>
                <div className="bottom-border-main-color">
                    <p>Предприятие</p>
                    <select className="accent-select" ref={facilityInput}>
                        {
                            facilitiesMetadata.map(fm=><option value={fm.id}>{fm.name}</option>)
                        }
                    </select>
                    </div>
            </div>
        </Dialog>
    )
}