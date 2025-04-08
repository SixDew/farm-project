import { useEffect, useState } from "react"
import { addToGroup, getGroupsMetadata, removeFromGroup, setSensorActive } from "../sensors/api/sensors-api";
import './DisabledSensor.css';
import SettingsMenuBoolElemet from "../sensors/SettingsMenuBoolElemet";

export default function DisabledSensors({imei, gps, sectionsMeta}){
    const [sensorGroups, setSensorGroups] = useState([])

    useEffect(()=>{
        async function getGroups() {
            setSensorGroups(await (await getGroupsMetadata(imei)).json())
        }

        getGroups()
    }, [imei])

    async function groupChangeEvent(event, sensorGroups, group){
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
                <button onClick={()=>{setSensorActive(true, imei)}}>Активировать</button>
            </div>
            <div className="disabled-sensor-info-container">
                {
                    sectionsMeta.map(section=><div key={section.id}>
                        <fieldset>
                            <legend>{section.metadata.name}</legend>
                            <div>
                                {
                                    section.groupsMetadata.map(group=><div>
                                        <SettingsMenuBoolElemet title={group.metadata.name} value={sensorGroups.find(g=>g.id == group.id)} 
                                        changeEvent={(event)=>groupChangeEvent(event, sensorGroups, group)} key={group.id}></SettingsMenuBoolElemet>
                                    </div>)
                                }
                            </div>
                        </fieldset>
                    </div>)
                }
            </div>
        </div>
    )
}