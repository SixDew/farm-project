import { useState } from "react"
import { FacilityMainData } from "../../interfaces/DtoInterfaces"
import { useAuth } from "../../AuthProvider"
import { toast } from "react-toastify"
import { removeFacility, updateFacilityData } from "../../sensors/api/sensors-api"
import UserElementField from "../../UserElementField"

import cancelImage from '../../images/white-cancel.png';
import changeImage from '../../images/white-change.png';
import deleteImage from '../../images/trash.png';
import saveImage from '../../images/save.png';

interface FacilityElementProps{
    facilityMainData:FacilityMainData
}

export default function FacilityElement({facilityMainData}:FacilityElementProps){
    const [isReadonly, setIsReadonly] = useState(true)
    const [name, setName] = useState(facilityMainData.name)
    const [inn, setInn] = useState(facilityMainData.inn)
    const [ogrn, setOgrn] = useState(facilityMainData.ogrn)
    const [adress, setAdress] = useState(facilityMainData.adress)
    const [contactData, setContactData] = useState(facilityMainData.contactData)
    const [registrationDate, setRegistrationDate] = useState(facilityMainData.registrationDate)
    const [additionalData, setAdditionalData] = useState(facilityMainData.additionalData)
    const authContext = useAuth()

    const [isDeleted, setIsDeleted] = useState(false)
    const [isChanging, setChanging] = useState(false)

    function resetValues(){
        setName(facilityMainData.name)
        setInn(facilityMainData.inn)
        setOgrn(facilityMainData.ogrn)
        setAdress(facilityMainData.adress)
        setContactData(facilityMainData.contactData)
        setRegistrationDate(facilityMainData.registrationDate)
        setAdditionalData(facilityMainData.additionalData)
        setChanging(false)
        setIsReadonly(true)
    }

    async function saveFacilityData(){
        const response = await authContext.sendWithAccessCheck(()=>updateFacilityData({
            id:facilityMainData.id,
            name:name,
            inn:inn,
            ogrn:ogrn,
            adress:adress,
            contactData:contactData,
            registrationDate:new Date(registrationDate).toISOString(),
            additionalData:additionalData
        }))
        if(response.ok){
            setChanging(false)
            setIsReadonly(true)
        }
        if(response.status == 400){
            toast.error(<div><h3>Ошибка при сохранении изменений</h3><p>Проверьте корректность данных</p></div>)
        }
    }

    async function deleteFacility() {
        const response = await removeFacility(facilityMainData.id)
        if(response.ok){
            setIsDeleted(true)
        }
    }

    return(
        <>
        {
            !isDeleted &&
            <tr className="users-table-row">
                <td><UserElementField type="text" value={name} isReadonly={isReadonly} onChange={(event)=>setName(event.target.value)}/></td>
                <td><UserElementField type="text" value={inn} isReadonly={isReadonly} onChange={(event)=>setInn(event.target.value)}/></td>
                <td><UserElementField type="text" value={ogrn} isReadonly={isReadonly} onChange={(event)=>setOgrn(event.target.value)}/></td>
                <td><UserElementField type="text" value={adress} isReadonly={isReadonly} onChange={(event)=>setAdress(event.target.value)}/></td>
                <td><UserElementField type="date" value={new Date(registrationDate).toISOString().substring(0, 10)} isReadonly={isReadonly} onChange={(event)=>setRegistrationDate(event.target.value)}/></td>
                <td><UserElementField type="text" value={contactData} isReadonly={isReadonly} onChange={(event)=>setContactData(event.target.value)}/></td>
                <td><UserElementField type="text" value={additionalData} isReadonly={isReadonly} onChange={(event)=>setAdditionalData(event.target.value)}/></td>
                <td>
                    <div className="row-buttons-container">
                        {isChanging ? 
                        <>
                                <button className="table-button" onClick={saveFacilityData}><img src={saveImage} width="32px" height="32px"></img></button>
                                <button className="table-button delete" onClick={resetValues}><img src={cancelImage} width="32px" height="32px"></img></button>
                            </> : <div>
                            <button className="table-button" onClick={()=>{
                                setIsReadonly(false)
                                setChanging(true)
                            }}><img src={changeImage} width="32px" height="32px"></img></button>
                            <button className="table-button delete" onClick={deleteFacility}><img src={deleteImage} width="32px" height="32px"></img></button>
                        </div>}
                    </div>
                </td>
            </tr>
        }
        </>
    )
}