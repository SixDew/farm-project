import { useRef, useState } from "react"
import { useAuth } from "../../AuthProvider"
import Dialog from "../group-page/Dialog"
import { createFacility } from "../../sensors/api/sensors-api"
import './CreateFacilityDialog.css'
import '../../main-style.css'

import plusImage from '../../images/plus.png'
import { toast } from "react-toastify"

interface CreateFacilityDialogProps{
    isOpen:boolean,
    OnEnd?:()=>void,
    OnCreateFacility?:()=>void
}

export default function CreateFacilityDialog({isOpen, OnEnd, OnCreateFacility}:CreateFacilityDialogProps){
    const nameInput = useRef<HTMLInputElement>(null)
    const innInput = useRef<HTMLInputElement>(null)
    const ogrnInput = useRef<HTMLInputElement>(null)
    const adressInput = useRef<HTMLInputElement>(null)
    const contactDataInput = useRef<HTMLInputElement>(null)
    const registrationDateInput = useRef<HTMLInputElement>(null)
    const additionalDataInput = useRef<HTMLTextAreaElement>(null)

    
    const [groups, setGroups] = useState<string[]>([])
    const [sections, setSections] = useState<string[]>([])
    const groupInput = useRef<HTMLInputElement>(null)
    const sectionInput = useRef<HTMLInputElement>(null)

    const authContext = useAuth()


        async function addFacility():Promise<boolean> {
            if(nameInput?.current?.value && innInput?.current?.value &&
                ogrnInput?.current?.value && adressInput?.current?.value &&
                contactDataInput?.current?.value && registrationDateInput?.current?.value &&
                additionalDataInput?.current?.value
            ){
                const response = await authContext.sendWithAccessCheck(()=>createFacility({
                name: nameInput.current!.value,
                inn: innInput.current!.value,
                ogrn: ogrnInput.current!.value,
                adress: adressInput.current!.value,
                contactData: contactDataInput.current!.value,
                registrationDate: new Date(registrationDateInput.current!.value).toISOString(),
                additionalData: additionalDataInput.current!.value,
                groups,
                sections
            }))
            if(response.ok){
                OnCreateFacility && OnCreateFacility()
                return true
            }
            else{
                toast.error(<div><h3>Ошибка при сохранении предприятия</h3><p>Проверьте корректность данных</p></div>)
                return false
            }
            }
            else{
                toast.error(<div><h3>Ошибка при сохранении предприятия</h3><p>Проверьте корректность данных</p></div>)
                return false
            }
        }

         function addGroup() {
            const value = groupInput.current?.value?.trim()
            if (value) {
            setGroups(prev => [...prev, value])
            groupInput.current!.value = ''
            }
        }

        function addSection() {
            const value = sectionInput.current?.value?.trim()
            if (value) {
            setSections(prev => [...prev, value])
            sectionInput.current!.value = ''
            }
        }
    
    return (
    <Dialog
      isOpen={isOpen}
      endButtonTitle="Создать"
      onEnd={async () => {
        var result = await addFacility()
        if(result) OnEnd && OnEnd()
      }}
    >
      <div className="create-facility-dialog-container">
            <div className="bottom-border-main-color">
                <p>Название предприятия</p>
                <input type="text" ref={nameInput} />
            </div>
            <div className="bottom-border-main-color">
                <p>ИНН</p>
                <input type="text" ref={innInput} />
            </div>
            <div className="bottom-border-main-color">
                <p>ОГРН</p>
                <input type="text" ref={ogrnInput} />
            </div>
            <div className="bottom-border-main-color">
                <p>Адрес</p>
                <input type="text" ref={adressInput} />
            </div>
            <div className="bottom-border-main-color">
                <p>Контактные данные</p>
                <input type="text" ref={contactDataInput} />
            </div>
            <div className="bottom-border-main-color">
                <p>Дата регистрации</p>
                <input type="date" ref={registrationDateInput} />
            </div>
            <div className="bottom-border-main-color">
                <p>Дополнительные сведения</p>
                <textarea ref={additionalDataInput} />
            </div>

            <p>Группы</p>
            <div className="groups-list-container">
                <input type="text" ref={groupInput} />
                <button className="standart-button" onClick={addGroup}>
                    <img src={plusImage} width="24" height="24" alt="Добавить группу" />
                </button>
                {groups.map((g, i) => <li key={i}>{g}</li>)}
            </div>

            <p>Секции</p>
            <div className="groups-list-container">
                <input type="text" ref={sectionInput} />
                <button className="standart-button" onClick={addSection}>
                    <img src={plusImage} width="24" height="24" alt="Добавить секцию" />
                </button>
                {sections.map((s, i) => <li key={i}>{s}</li>)}
            </div>
        </div>
    </Dialog>
  )
}