import { useEffect, useState } from "react"
import { addToGroup, getGroupsMetadata, removeFromGroup, setSensorActive } from "../sensors/api/sensors-api";
import './DisabledSensor.css';
import SettingsMenuBoolElemet from "../sensors/SettingsMenuBoolElemet";
import { FacilityDeepMetaDto, SensorGroupMetaDto } from "../interfaces/DtoInterfaces";

interface DisabledSensorsProps{
    imei:string,
    gps:string,
    facilitiesMeta:FacilityDeepMetaDto[]
}

export default function DisabledSensors({imei, gps, facilitiesMeta}:DisabledSensorsProps){
    const [sensorGroups, setSensorGroups] = useState<SensorGroupMetaDto[]>([])
    const [selectedFacility, setSelectedFacility] = useState<FacilityDeepMetaDto>()

    useEffect(()=>{
        async function getGroups() {
            setSensorGroups(await (await getGroupsMetadata(imei)).json())
        }

        getGroups()
    }, [imei])

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
                    selectedFacility && <button onClick={()=>{setSensorActive(true, imei)}}>Активировать</button>
                }
            </div>
            <div className="disabled-sensor-info-container">
                <p>Предприятие:</p>
                <select onChange={(e)=>{
                        console.log("change")
                        setSelectedFacility(facilitiesMeta.find(f=>f.id == Number(e.target.value)))
                    }}>
                        <option value={0}>Выберете предприятие</option>
                        {
                            facilitiesMeta.map(facility=><option value={facility.id}>{facility.name}</option>)
                        }
                </select>
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