import { useEffect, useState } from "react"
import {addSection, getFacilities, getSections } from "../../sensors/api/sensors-api"
import { FacilityDto } from "../../interfaces/DtoInterfaces"
import SectionElement from "./SectionElement"
import GroupElement from "./GroupElement"
import "./GroupPage.css"

export default function GroupPage(){
    const [facilities, setFacilities] = useState<FacilityDto[]>([])

    useEffect(()=>{
        async function getAllFacilities() {
            var facilities = await (await getFacilities()).json();
            console.log(facilities);
            setFacilities(facilities);
        }
        getAllFacilities();
    },[])

    return (
        <>
        {
            facilities.map(f=>{
                return (
                    <div className="factility-element">
                        <h2>Предприятие: {f.name}</h2>
                        <div>
                        <h3>Секции</h3>
                        {
                            f.sections.map(s=>{
                                return (
                                    <SectionElement name={s.name} sensors={s.sensors} key={s.id}></SectionElement>
                                )
                            })
                        }
                        </div>
                        <h3>Группы</h3>
                        {
                            f.groups.map(g=>{
                                return (
                                    <GroupElement name={g.name} sensors={g.sensors} key={g.id}></GroupElement>
                                )
                            })
                        }
                    </div>
                )
            })
        }
        </>
    )
}