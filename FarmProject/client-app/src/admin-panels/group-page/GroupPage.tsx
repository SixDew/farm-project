import { useEffect, useState } from "react"
import { AlarmablePressureSensor, FacilityDto, PressureSensorDto, SensorGroupDto, SensorSectionDto } from "../../interfaces/DtoInterfaces"
import SectionElement from "./SectionElement"
import "./GroupPage.css"
import MultiplyAccordion, { AccordingSector } from "./MultiplyAccordion"
import GroupAccordingElement from "./GroupAccordingElement"
import EditGroupDialog from "./EditGroupDialog"
import CreateGroupDialog from "./CreateGroupDialog"
import SectionAccordingElement from "./SectionAccordingElement"
import CreateSectionDialog from "./CreateSectionDialog"
import EditSectionDialog from "./EditSectionDialog"
import PageContentBase from "../../PageContentBase"
import { useAuth } from "../../AuthProvider"

interface GroupPageProps{
    facility:FacilityDto|undefined
    alarmedSensors:AlarmablePressureSensor[],
    sensors:AlarmablePressureSensor[],
    disabledSensors:PressureSensorDto[]
    setFacility:React.Dispatch<React.SetStateAction<FacilityDto | undefined>>
}

interface VisibleSensorGroup extends SensorGroupDto{
    isVisible:boolean
}

interface VisibleSectionWithGroups extends SensorSectionDto{
    isVisible:boolean,
    groups:VisibleSensorGroup[]
}

function moveItem(arr:any[], fromIndex:number, toIndex:number):any[]{
    const copy = [...arr]
    const [removed] = copy.splice(fromIndex, 1)
    copy.splice(toIndex, 0, removed)
    return copy
}

export default function GroupPage({facility, alarmedSensors, sensors, disabledSensors, setFacility}:GroupPageProps){
    const [visibleGroups, setVisibleGroups] = useState<VisibleSensorGroup[]>([])
    const [showEditGroupDialog, setShowEditGroupDialog] = useState<boolean>(false)
    const [showCreateGroupDialog, setShowCreateGroupDialog] = useState<boolean>(false)
    const [showCreateSectionDialog, setShowCreateSectionDialog] = useState<boolean>(false)
    const [showEditSectionDialog, setShowEditSectionDialog] = useState<boolean>(false)
    const [groupToEdit, setGroupToEdit] = useState<SensorGroupDto>()
    const [sectionToEdit, setSectionToEdit] = useState<SensorSectionDto>()
    const [visibleSections, setVisibleSections] = useState<VisibleSectionWithGroups[]>([])
    const authContext = useAuth() 

    useEffect(()=>{
        const buffVisibleGroups:VisibleSensorGroup[] = []
        facility?.groups.forEach(group=>{
            buffVisibleGroups.push({...group, isVisible:Boolean(visibleGroups.find(vg=>vg.id == group.id && vg.isVisible))})
        })
        setVisibleGroups(buffVisibleGroups)
    }, [facility])

    useEffect(()=>{
        let buffVisibleSections:VisibleSectionWithGroups[] = [...visibleSections]
        //Убираем удаленные секции
        buffVisibleSections = buffVisibleSections.filter(s=>facility?.sections.find(fs=>fs.id == s.id))

        facility?.sections.forEach(section=>{
            const visibleSection = buffVisibleSections.find(s=>s.id == section.id)
            //Если секция уже добавлена
            if(visibleSection){
                //Обновляем метаданные
                visibleSection.name = section.name
                visibleSection.zone = section.zone

                const buffVisibleGroups:VisibleSensorGroup[] = []
                facility?.groups.forEach(group=>{
                        //Если группа есть в старой секции
                        const finderGroup = visibleSection.groups.find(g=>g.id == group.id)
                        if(finderGroup){
                            //Обновляем метаданные
                            finderGroup.name = group.name

                            //Обновляем список датчиков
                            const sensors = group.sensors.filter(s=>section.sensors.find(sectionSensor=>sectionSensor.imei == s.imei))
                            if(sensors.length > 0){
                                finderGroup.sensors = sensors
                            }
                            else{
                                //Если список пуст, удаляем группу
                                visibleSection.groups = visibleSection.groups.filter(g=>g.id != finderGroup.id)
                            }
                        }
                        else{
                            //Иначе просто добавляем группу в буфер если в ней есть датчики секции
                            if(group.sensors.find(s=>section.sensors.find(sectionSensor=>sectionSensor.imei == s.imei))){
                                buffVisibleGroups.push({...group, sensors:group.sensors.filter(s=>section.sensors.find(sectionSensor=>sectionSensor.imei == s.imei)),
                                    isVisible:false})
                            }
                        }
                })

                //Убираем удаленные группы (если есть)
                visibleSection.groups.forEach(group=>{
                    if(!Boolean(facility?.groups.find(g=>g.id == group.id))){
                        visibleSection.groups = visibleSection.groups.filter(g=>g.id != group.id)
                    }
                })

                //Добавляем новые группы
                buffVisibleGroups.forEach(g=>visibleSection.groups.push(g))
            }
            else{
                const buffVisibleGroups:VisibleSensorGroup[] = []
                //Добавляем в буфер нужные группы
                facility?.groups.forEach(group=>{
                    if(group.sensors.find(s=>section.sensors.find(sectionSensor=>sectionSensor.imei == s.imei))){
                        buffVisibleGroups.push({...group, sensors:group.sensors.filter(s=>section.sensors.find(sectionSensor=>sectionSensor.imei == s.imei)),
                            isVisible:Boolean(visibleSections.find(section=>{section.groups.find(g=>g.id == group.id && g.isVisible)}))})
                    }
                })
                //Добавляем в буфер секцию
                buffVisibleSections.push({...section, groups:buffVisibleGroups, isVisible:Boolean(visibleSections.find(vs=>vs.id == section.id && vs.isVisible))})
            }
        })
        setVisibleSections(buffVisibleSections)
    }, [facility])

    return(
        <>
            {
                facility && 
            (
                <PageContentBase title="Мониторинг">
                    {
                        groupToEdit && authContext.role == "admin" && <EditGroupDialog 
                        isOpen={showEditGroupDialog}
                        group={groupToEdit}
                        sensors={sensors}
                        disabledSensors={disabledSensors}
                        onEnd={()=>{
                            setShowEditGroupDialog(false)
                            setGroupToEdit(undefined)
                        }}
                        onGroupChange={(updatedGroup)=>{
                                facility.groups = facility.groups.map(group=>
                                    group.id == updatedGroup.id ? updatedGroup : group
                                )
                                console.log('updated facility', facility)
                                setFacility({...facility})
                        }}
                        onGroupDeleted={(groupMeta)=>{
                            facility.groups = facility.groups.filter(g=>g.id != groupMeta.id)
                            setFacility({...facility})
                        }}
                        onGroupMetadataChange={(groupMeta)=>{
                            facility.groups = facility.groups.map(g=>{
                                if(g.id == groupMeta.id){
                                    g.name = groupMeta.name
                                }
                                return g
                            })
                        }}
                        ></EditGroupDialog>
                    }
                    {
                        sectionToEdit && authContext.role == "admin" && <EditSectionDialog
                            isOpen={showEditSectionDialog}
                            section={sectionToEdit}
                            onEnd={()=>setShowEditSectionDialog(false)}
                            onSectionDelete={(section)=>{
                                facility.sections = facility.sections.filter(s=>s.id != section.id)
                                setFacility({...facility})
                            }}
                            onSectionChange={(sectionMeta)=>{
                                facility.sections = facility.sections.map(s=>{
                                    if(s.id == sectionMeta.id){
                                        s.name = sectionMeta.name
                                    }
                                    return s
                                })
                                setFacility({...facility})
                            }}
                        >
                        </EditSectionDialog>
                    }
                    {
                        authContext.role == "admin" && <>
                            <CreateGroupDialog 
                                isOpen={showCreateGroupDialog}
                                OnEnd={()=>setShowCreateGroupDialog(false)}
                                facilityId={facility.id}
                                onGroupAdd={(group)=>{
                                    facility.groups.push(group)
                                    setFacility({...facility})
                                }}
                                >
                            </CreateGroupDialog>
                            <CreateSectionDialog
                                isOpen={showCreateSectionDialog}
                                facilityId={facility.id}
                                onEnd={()=>setShowCreateSectionDialog(false)}
                                onSectionAdd={(section)=>{
                                    facility.sections.push(section)
                                    setFacility({...facility})
                                }}
                            >
                            </CreateSectionDialog>
                        </>
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
                                                setShowEditGroupDialog(!showEditGroupDialog)
                                                setGroupToEdit(group)
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
                                            key={"group-according-element"+group.id}
                                        ></GroupAccordingElement>
                                    )
                                }
                                <button
                                    className="add-element-button"
                                    onClick={()=>{
                                        setShowCreateGroupDialog(true)
                                    }}
                                >
                                    +
                                </button>
                            </AccordingSector>
                            <AccordingSector title="Секции" className="according-sector">
                                {
                                    visibleSections.map((section, index)=>{
                                        return(
                                            <SectionAccordingElement
                                            className="group-according-element"
                                            isVisible={section?.isVisible ? true : false}
                                            sectionName={section.name}
                                            key={section.id}
                                            onChangeVisible={()=>{
                                                const currentSection = visibleSections.find(s=>s.id == section.id)
                                                if(currentSection){
                                                    if(currentSection.isVisible){
                                                        currentSection.isVisible = false
                                                        setVisibleSections([...visibleSections])
                                                    }
                                                    else{
                                                        currentSection.isVisible = true
                                                        setVisibleSections([...visibleSections])
                                                    }
                                                }
                                            }}
                                            onClick={()=>{
                                                setSectionToEdit(section)
                                                setShowEditSectionDialog(!showEditSectionDialog)
                                            }}
                                            onPositionDown={()=>{
                                                const buffer:VisibleSectionWithGroups[] = moveItem(visibleSections, index, index + 1)
                                                setVisibleSections(buffer)
                                            }}
                                            onPositionUp={()=>{
                                                const buffer:VisibleSectionWithGroups[] = moveItem(visibleSections, index, index - 1)
                                                setVisibleSections(buffer)
                                            }}
                                        >
                                            {
                                                section?.groups.map((group, index)=>
                                                    <GroupAccordingElement
                                                    className="group-according-element"
                                                    name={group.name} 
                                                    groupSensorsCount={group.sensors.length}
                                                    groupAlarmedSensorsCount={group.sensors.filter(s=>alarmedSensors.find(sensor=>sensor.imei == s.imei)).length}
                                                    isVisible={group.isVisible}
                                                    onChangeVisible={()=>{
                                                        if(group.isVisible){
                                                            group.isVisible = false
                                                            setVisibleGroups([...visibleGroups])
                                                        }
                                                        else{
                                                            group.isVisible = true
                                                            setVisibleGroups([...visibleGroups])
                                                        }
                                                    }}
                                                    onPositionUp={()=>{
                                                        section.groups = moveItem(section.groups, index, index - 1)
                                                        console.log("up group pos", facility)
                                                        setVisibleSections([...visibleSections])
                                                    }}
                                                    onPositionDown={()=>{
                                                        section.groups = moveItem(section.groups, index, index + 1)
                                                        console.log("down group pos", facility)
                                                        setVisibleSections([...visibleSections])
                                                    }}
                                                    onClick={(e)=>{
                                                        e.stopPropagation()
                                                        setShowEditGroupDialog(!showEditGroupDialog)
                                                        setGroupToEdit(group)
                                                    }}
                                                ></GroupAccordingElement>
                                                )
                                            }
                                        </SectionAccordingElement>
                                        )
                                    }
                                    )
                                }
                                <button
                                    className="add-element-button"
                                    onClick={()=>setShowCreateSectionDialog(true)}
                                >
                                    +
                                </button>
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
                                                sensors={group.sensors.map(s=>sensors.find(sensor=>sensor.imei == s.imei))}
                                                key={group.id}
                                                disabledSensors={disabledSensors}
                                            >
                                            </SectionElement>
                                        </>
                                    )
                                }
                            })
                        }
                        {
                            visibleSections.map(section=>{
                                if(section.isVisible){
                                    return(
                                        <>
                                            <SectionElement
                                                name={section.name}
                                                sensors={section.sensors.map(s=>sensors.find(sensor=>sensor.imei == s.imei))}
                                                key={section.id}
                                                disabledSensors={disabledSensors}
                                            >
                                                {
                                                    section.groups.map(group=>{
                                                        if(group.isVisible){
                                                            return (
                                                                <SectionElement
                                                                    name={group.name}
                                                                    sensors={group.sensors.map(s=>sensors.find(sensor=>sensor.imei == s.imei))}
                                                                    key={"section-group"+group.id}
                                                                    disabledSensors={disabledSensors}
                                                                ></SectionElement>
                                                            )
                                                        }
                                                    }
                                                    )
                                                }
                                            </SectionElement>
                                        </>
                                    )
                                }
                            })
                        }
                    </div>

                    <SectionElement 
                        name="Аварийные датчики"
                        sensors={alarmedSensors} 
                        disabledSensors={disabledSensors}
                        className="alarm-section-element"
                        sensorsContainerClassName="alarm-sensors"
                        >

                    </SectionElement>
                </PageContentBase>
            )
            }
        </>
    )

}