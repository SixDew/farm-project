import Control from "react-leaflet-custom-control"
import "./SelectedSectionMenu.css"
import { ZoneProperties } from "./MapPage"
import { SensorGroupDto, SensorSectionDto } from "../../interfaces/DtoInterfaces"
import { useEffect, useState } from "react"
import { useMap } from "react-leaflet"

interface SelectedZoneMenuProps{
    selectedSection:SensorSectionDto | null,
    sections:SensorSectionDto[],
    groups:SensorGroupDto[],
    onSectionSelect:(e:React.ChangeEvent<HTMLSelectElement>)=>void
}

interface GroupSelectedMarker{
    groupId:number,
    isSelected:boolean
}

export default function SelectedSectionMenu({selectedSection, sections, groups, onSectionSelect}:SelectedZoneMenuProps){
    const map = useMap()
    const [groupSelecetedMarkers, setGroupSelectedMarkers] = useState<GroupSelectedMarker[]>([])

    useEffect(()=>{
        const groupArrayBuffer:GroupSelectedMarker[] = []
        groups.map(group=>{
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
            <select onChange={onSectionSelect}>
            <option value={0}>-Выберете секцию-</option>
                {
                    sections.map(section=>{
                        if(selectedSection && section.id == selectedSection.id){
                            return (
                                <option value={section.id} selected>{section.name}</option>
                            )
                        }
                        else{
                            return (
                                <option value={section.id}>{section.name}</option>
                            )
                        }
                    })
                }
            </select>
            {
                selectedSection && (
                    <div className="selected-section-sensors">
                        {
                            groups.map(group=>{
                                return (
                                    <div>
                                        <button onClick={()=>onGroupSelect(group.id)}><h5>{group.name}</h5></button>
                                        {
                                            groupSelecetedMarkers.find(m=>m.groupId == group.id)?.isSelected && (
                                                <div className="group-sensors-section">
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