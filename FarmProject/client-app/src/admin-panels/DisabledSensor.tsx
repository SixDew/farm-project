import { useEffect, useState } from "react"
import { addToGroup, deleteSensor, getGroupsMetadata, removeFromGroup, setSensorActive } from "../sensors/api/sensors-api";
import './DisabledSensor.css';
import SettingsMenuBoolElemet from "../sensors/SettingsMenuBoolElemet";
import { FacilityDeepMetaDto, PressureSensorDto, SensorGroupMetaDto, SensorSectionMetaDto } from "../interfaces/DtoInterfaces";

interface DisabledSensorsProps{
    imei:string,
    gps:string,
    facilitiesMeta:FacilityDeepMetaDto[],
    setDisabledSensors:React.Dispatch<React.SetStateAction<PressureSensorDto[]>>,
    onDeleteSensor?:(sensor:PressureSensorDto)=>void
}

export default function DisabledSensors({imei, gps, facilitiesMeta, setDisabledSensors, onDeleteSensor}:DisabledSensorsProps){
    const [sensorGroups, setSensorGroups] = useState<SensorGroupMetaDto[]>([])
    const [selectedFacility, setSelectedFacility] = useState<FacilityDeepMetaDto>()
    const [selectedSection, setSelectedSection] = useState<SensorSectionMetaDto>()

    useEffect(()=>{
        async function getGroups() {
            setSensorGroups(await (await getGroupsMetadata(imei)).json())
        }

        getGroups()
    }, [imei])

    async function activateSensor(sectionId?:number) {
        var response = await setSensorActive(true, imei, sectionId)
        if(response.ok){
            setDisabledSensors(prev=>prev.filter(s=>s.imei != imei))
        }
    }

    async function deleteSensorAsyc() {
        var response = await deleteSensor(imei)
        if(response.ok){
            onDeleteSensor && onDeleteSensor(await response.json())
        }
    }

    async function groupChangeEvent(event:React.ChangeEvent<HTMLInputElement>,
         sensorGroups:SensorGroupMetaDto[], group:SensorGroupMetaDto){
        if(event.target.checked && !sensorGroups.find(g=>g.id == group.id)){
            const response = await addToGroup(group.id, imei)
            if(response.ok){
                setSensorGroups(prev=>[...prev, group])
            }
        }
        if(!event.target.checked && sensorGroups.find(g=>g.id==group.id)){
            const response = await removeFromGroup(group.id, imei)
            if(response.ok){
                setSensorGroups(prev=>prev.filter(g=>g.id != group.id))
            }
        }
    }

    return (
        <div className="disabled-sensor">
            <div className="disabled-sensor-info-container">
                <p>Imei:{imei}</p>
                <p>GPS:{gps}</p>
                {
                    selectedFacility && selectedSection && <button onClick={()=>activateSensor(selectedSection.id)}>Активировать</button>
                }
                <button onClick={deleteSensorAsyc}>УДАЛИТЬ</button>
            </div>
            <div className="disabled-sensor-info-container">
                <p>Предприятие:</p>
                <select onChange={(e)=>{
                        setSelectedFacility(facilitiesMeta.find(f=>f.id == Number(e.target.value)))
                    }}>
                        <option value={undefined}>Выберете предприятие</option>
                        {
                            facilitiesMeta.map(facility=><option value={facility.id}>{facility.name}</option>)
                        }
                </select>
                {
                    selectedFacility &&
                    <select onChange={(e)=>{
                        setSelectedSection(selectedFacility.sections.find(s=>s.id == Number(e.target.value)))
                    }}>
                        <option value={undefined}>Выберете секцию</option>
                        {
                            selectedFacility.sections.map(s=><option value={s.id}>{s.name}</option>)
                        }
                    </select>
                }
                {
                    
                    selectedFacility && (
                                    <div>
                                        {
                                        selectedFacility.groups.map(group=><div>
                                            <SettingsMenuBoolElemet title={group.name} value={Boolean(sensorGroups.find(g=>g.id == group.id))} 
                                                changeEvent={(event)=>groupChangeEvent(event, sensorGroups, group)} key={group.id}></SettingsMenuBoolElemet>
                                        </div>)
                                    }
                                    </div>
                                )
                }
            </div>
        </div>
    )
}