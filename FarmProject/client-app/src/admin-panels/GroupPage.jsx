import { useEffect, useState } from "react"
import { addGroup, addSection, getSections } from "../sensors/api/sensors-api"
import SectionElement from "./SectionElement";

export default function GroupPage(){
    const [sections, setSections] = useState([])

    useEffect(()=>{
        async function getAllSections() {
            var sections = await (await getSections()).json();
            console.log(sections);
            setSections(sections);
        }
        getAllSections();
    },[])

    return (
        <>
        {
            sections.map(s=><SectionElement name={s.metadata.name} groups={s.groups} key={s.id} sectionId={s.id}></SectionElement>)
        }
        <button onClick={()=>addSection("Предприятие 1")}>Добавить секцию</button>
        </>
    )
}