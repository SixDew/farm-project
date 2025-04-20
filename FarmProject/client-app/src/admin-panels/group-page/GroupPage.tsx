import { useEffect, useState } from "react"
import {addSection, getFacilities, getSections } from "../../sensors/api/sensors-api"
import { FacilityDto, SensorGroupDto, SensorSectionDto } from "../../interfaces/DtoInterfaces"
import SectionElement from "./SectionElement"
import GroupElement from "./GroupElement"
import "./GroupPage.css"
import MultiplyAccordion, { AccordingSector } from "./MultiplyAccordion"

interface GroupPageProps{
    facility:FacilityDto|undefined
}

export default function GroupPage({facility}:GroupPageProps){

    const [selectedSensorsSet, setSelectedSensorsSet] = useState<SensorGroupDto | SensorSectionDto>()

    return(
        <>
        {
            facility && (
                <div className="main-group-page-container">
                    <div className="groups-panel">
                        <MultiplyAccordion>
                            <AccordingSector title="Группы" className="according-sector">
                                {
                                    facility.groups.map(group=>
                                        <button className="according-element" onClick={()=>setSelectedSensorsSet(group)}>
                                            {group.name}
                                        </button>
                                    )
                                }
                            </AccordingSector>
                            <AccordingSector title="Секции" className="according-sector">
                                {
                                    facility.sections.map(secttion=>
                                        <button className="according-element" onClick={()=>setSelectedSensorsSet(secttion)}>
                                            {secttion.name}
                                        </button>
                                    )
                                }
                            </AccordingSector>
                        </MultiplyAccordion>
                    </div>

                    <div className="sensors-panel">
                        {
                            selectedSensorsSet && (
                                <SectionElement name={selectedSensorsSet.name} sensors={selectedSensorsSet.sensors}></SectionElement>
                            )
                        }
                    </div>
                </div>
            )
        }
        </>
    )

}