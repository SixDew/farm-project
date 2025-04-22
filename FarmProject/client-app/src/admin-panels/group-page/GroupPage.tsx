import { useEffect, useState } from "react"
import { AlarmablePressureSensor, FacilityDto, SensorGroupDto } from "../../interfaces/DtoInterfaces"
import SectionElement from "./SectionElement"
import "./GroupPage.css"
import MultiplyAccordion, { AccordingSector } from "./MultiplyAccordion"
import GroupAccordingElement from "./GroupAccordingElement"
import SensorAddDialog from "./SensorAddDialog"

interface GroupPageProps{
    facility:FacilityDto|undefined
    alarmedSensors:AlarmablePressureSensor[],
    sensors:AlarmablePressureSensor[],
    setFacility:React.Dispatch<React.SetStateAction<FacilityDto | undefined>>
}

interface VisibleSensorGroups extends SensorGroupDto{
    isVisible:boolean
}

function moveItem(arr:any[], fromIndex:number, toIndex:number):any[]{
    const copy = [...arr]
    const [removed] = copy.splice(fromIndex, 1)
    copy.splice(toIndex, 0, removed)
    return copy
}

export default function GroupPage({facility, alarmedSensors, sensors, setFacility}:GroupPageProps){
    const [visibleGroups, setVisibleGroups] = useState<VisibleSensorGroups[]>([])
    const [showAddSensorDialog, setShowAddSensorDialog] = useState<boolean>(false)
    const [groupToSensorAdd, setGroupToSensorAdd] = useState<SensorGroupDto>() 

    useEffect(()=>{
        const buffVG:VisibleSensorGroups[] = []
        facility?.groups.forEach(group=>{
            buffVG.push({...group, isVisible:Boolean(visibleGroups.find(vg=>vg.id == group.id && vg.isVisible))})
        })
        setVisibleGroups(buffVG)
    }, [facility])

    return(
        <>
        {
            facility && (
                <div className="main-group-page-container">
                    {
                        groupToSensorAdd && <SensorAddDialog 
                        isOpen={showAddSensorDialog}
                        group={groupToSensorAdd}
                        sensors={sensors}
                        onEnd={()=>{
                            setShowAddSensorDialog(false)
                            setGroupToSensorAdd(undefined)
                        }}
                        onGroupChange={(updatedGroup)=>{
                                facility.groups = facility.groups.map(group=>
                                    group.id == updatedGroup.id ? updatedGroup : group
                                )
                                console.log('updated facility', facility)
                                setFacility({...facility})
                        }}
                        ></SensorAddDialog>
                    }
                    <div className="groups-panel">
                        <MultiplyAccordion>
                            <AccordingSector title="Группы" className="according-sector">
                                {
                                    facility.groups.map((group, index)=>
                                        <GroupAccordingElement
                                            className="group-according-element"
                                            name={group.name} 
                                            groupSensorsCount={group.sensors.length}
                                            groupAlarmedSensorsCount={group.sensors.filter(s=>alarmedSensors.find(sensor=>sensor.imei == s.imei)).length}
                                            isVisible={visibleGroups.find(g=>g.id == group.id)?.isVisible ? true : false}
                                            onChangeVisible={()=>{
                                                const currentGroup = visibleGroups.find(g=>g.id == group.id)
                                                if(currentGroup){
                                                    if(currentGroup.isVisible){
                                                        currentGroup.isVisible = false
                                                        setVisibleGroups([...visibleGroups])
                                                    }
                                                    else{
                                                        currentGroup.isVisible = true
                                                        setVisibleGroups([...visibleGroups])
                                                    }
                                                }
                                            }}
                                            onClick={()=>{
                                                setShowAddSensorDialog(!showAddSensorDialog)
                                                setGroupToSensorAdd(group)
                                            }}
                                            onPositionUp={()=>{
                                                facility.groups = moveItem(facility.groups, index, index - 1)
                                                console.log("up group pos", facility)
                                                setFacility({...facility})
                                            }}
                                            onPositionDown={()=>{
                                                facility.groups = moveItem(facility.groups, index, index + 1)
                                                console.log("down group pos", facility)
                                                setFacility({...facility})
                                            }}
                                        ></GroupAccordingElement>
                                    )
                                }
                            </AccordingSector>
                            <AccordingSector title="Секции" className="according-sector">
                                {
                                    facility.sections.map(secttion=>
                                        <button className="according-element">
                                            {secttion.name}
                                        </button>
                                    )
                                }
                            </AccordingSector>
                        </MultiplyAccordion>
                    </div>

                    <div className="sensors-panel">
                        {
                            visibleGroups.map(group=>
                            {
                                if(group.isVisible){
                                    return (
                                        <>
                                            <SectionElement
                                                name={group.name}
                                                sensors={group.sensors}
                                                key={group.id}
                                            >
                                            </SectionElement>
                                        </>
                                    )
                                }
                            })
                        }
                    </div>
                </div>
            )
        }
        </>
    )

}