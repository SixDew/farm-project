import { useEffect, useState } from "react"
import { getFacilitiesMainData } from "../../sensors/api/sensors-api"
import { FacilityMainData } from "../../interfaces/DtoInterfaces"
import { useAuth } from "../../AuthProvider"
import PageContentBase from "../../PageContentBase"
import FacilityElement from "./FacilityElement"

import plusImage from '../../images/plus.png'
import CreateFacilityDialog from "./CreateFacilityDialog"

interface FacilitiesPageProps{

}

export default function FacilitiesPage({}:FacilitiesPageProps){
    const [facilities, setFacilities] = useState<FacilityMainData[]>([])
    const [addMode, setAddMode] = useState<boolean>(false)
    const authContext = useAuth()
    
    async function getFacilitiesData(){
        const response = await authContext.sendWithAccessCheck(getFacilitiesMainData)
        if(response.ok){
            setFacilities(await response.json())
        }
    }

    useEffect(()=>{
        getFacilitiesData()
    }, [])

    return (
        <PageContentBase title="Предприятия">
            <div id="main-users-table-container">
            {
                addMode && <CreateFacilityDialog 
                    isOpen={addMode}
                    OnCreateFacility={()=>{
                        getFacilitiesData()
                    }}
                    OnEnd={()=>setAddMode(false)}
                />
            }
            <table className="users-table">
                <thead>
                    <tr className="table-head">
                        <th>Название</th>
                        <th>ИНН</th>
                        <th>ОГРН/ОГРНИП</th>
                        <th>Адрес</th>
                        <th>Дата регистрации</th>
                        <th>Контактные данные</th>
                        <th>Дополнительные сведения</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {facilities.map((facility, index)=><FacilityElement facilityMainData={facility} key={index}/>)}
                </tbody>
            </table>
            <button className="standart-button bottom-left" onClick={()=>setAddMode(!addMode)}><img src={plusImage} width="48px" height="48px"></img></button>
        </div>
        </PageContentBase>
    )
}