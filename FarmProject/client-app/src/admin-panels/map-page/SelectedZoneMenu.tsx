import Control from "react-leaflet-custom-control"
import "./SelectedZoneMenu.css"
import { ZoneProperties } from "./MapPage"
import { SensorSectionDto } from "../../interfaces/DtoInterfaces"
import { useEffect, useState } from "react"
import { useMap } from "react-leaflet"

interface SelectedZoneMenuProps{
    selectedZone:ZoneProperties | null,
    selectedSection:SensorSectionDto | null,
    sections:SensorSectionDto[],
}

interface GroupSelectedMarker{
    groupId:number,
    isSelected:boolean
}

export default function SelectedZoneMenu({selectedZone, selectedSection, sections}:SelectedZoneMenuProps){
    const map = useMap()
    const [groupSelecetedMarkers, setGroupSelectedMarkers] = useState<GroupSelectedMarker[]>([])

    useEffect(()=>{
        const groupArrayBuffer:GroupSelectedMarker[] = []
        selectedSection?.groups.map(group=>{
            groupArrayBuffer.push({groupId:group.id, isSelected:false})
        })
        setGroupSelectedMarkers(groupArrayBuffer)
    },[selectedSection])

    function onGroupSelect(groupId:number){
        var selectedMarker = groupSelecetedMarkers.find(m=>m.groupId == groupId)
        if(selectedMarker){
            selectedMarker.isSelected = !selectedMarker.isSelected
        }
        setGroupSelectedMarkers(prev=>[...prev])
    }

    function onSensorClick(coordX:number|undefined, coordY:number|undefined){
        if(coordX && coordY){
          map.flyTo([coordX, coordY], map.getZoom(), {
            duration:0.5
          })
        }
    }
    

    return (
        <Control prepend position="topright">
          <div className="selected-zone-menu">
            <select>
                {
                    sections.map(section=>{
                        if(selectedSection && section.id == selectedSection.id){
                            return (
                                <option value={section.id} selected>{section.metadata.name}</option>
                            )
                        }
                        else{
                            return (
                                <option value={section.id}>{section.metadata.name}</option>
                            )
                        }
                    })
                }
            </select>
            {
                selectedZone && (
                    <>
                    <h3>Зона: {selectedZone.name}</h3>
                    <h3>Id: {selectedZone.id}</h3>
                    </>
                )
            }
            {
                selectedSection && (
                    <div className="selected-section-sensors">
                        {
                            selectedSection.groups.map(group=>{
                                return (
                                    <div>
                                        <button onClick={()=>onGroupSelect(group.id)}><h5>{group.metadata.name}</h5></button>
                                        {
                                            groupSelecetedMarkers.find(m=>m.groupId == group.id)?.isSelected && (
                                                <div>
                                                    {
                                                        group.sensors.map(sensor=>{
                                                            return (
                                                               <div>
                                                                 <button onClick={()=>{
                                                                    onSensorClick(Number(sensor.gps.split(' ').at(0)),Number(sensor.gps.split(' ').at(1)))
                                                                }}>
                                                                    Imei: {sensor.imei}
                                                                </button>
                                                               </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            )
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            }
          </div>
        </Control>
    )
}