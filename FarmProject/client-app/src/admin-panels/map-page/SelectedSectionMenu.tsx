import Control from "react-leaflet-custom-control"
import "./SelectedSectionMenu.css"
import { PressureSensorDto, SensorGroupDto, SensorSectionDto } from "../../interfaces/DtoInterfaces"
import MultiplyAccordion, { AccordingSector } from "../group-page/MultiplyAccordion"

interface SelectedZoneMenuProps{
    selectedSection:SensorSectionDto | null,
    sections:SensorSectionDto[],
    groups:SensorGroupDto[],
    onSectionSelect:(e:React.ChangeEvent<HTMLSelectElement>)=>void
    onSensorSelect?:(sensor:PressureSensorDto)=>void
}

interface GroupSelectedMarker{
    groupId:number,
    isSelected:boolean
}

export default function SelectedSectionMenu({selectedSection, sections, groups, onSectionSelect, onSensorSelect}:SelectedZoneMenuProps){
    return (
        <Control prepend position="topright">
          <div className="selected-zone-menu">
            <select className="section-select-button" onChange={onSectionSelect}>
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
                    <MultiplyAccordion>
                        <AccordingSector title="Группы" className="map-groups-according-sector">
                            <MultiplyAccordion>
                                {
                                    groups.filter(group=>group.sensors.find(s=>selectedSection.sensors.find(sectionSensor=>s.imei == sectionSensor.imei)))
                                    .map(group=>{
                                        return (
                                            <AccordingSector title={group.name} className="group-according-sector">
                                                {
                                                    group.sensors.map(sensor=>{
                                                        if(selectedSection.sensors.find(s=>s.imei == sensor.imei)){
                                                            return (
                                                                <div>
                                                                    <button className="select-menu-sensor-button" onClick={()=>{
                                                                        onSensorSelect && onSensorSelect(sensor)
                                                                    }}>
                                                                        Сенсор: {sensor.imei}
                                                                    </button>
                                                                </div>
                                                                )
                                                        }
                                                    })
                                                }
                                            </AccordingSector>
                                        )
                                    })
                                }
                            </MultiplyAccordion>
                        </AccordingSector>
                        <AccordingSector title="Все датчики" className="map-groups-according-sector">
                            {
                                selectedSection.sensors.map(sensor=>{
                                    return (
                                        <div>
                                            <button className="select-menu-sensor-button" onClick={()=>{
                                                onSensorSelect && onSensorSelect(sensor)
                                            }}>
                                                Сенсор: {sensor.imei}
                                            </button>
                                        </div>
                                    )
                                })
                            }
                        </AccordingSector>
                    </MultiplyAccordion>
                )
            }
          </div>
        </Control>
    )
}