import React, { useEffect, useState, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, FeatureGroup, useMap, GeoJSON, Marker, Tooltip, Popup} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./SelectedSectionMenu.css"
import "leaflet-draw/dist/leaflet.draw.css";
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import { GeomanControls, layerEvents } from 'react-leaflet-geoman-v2';
import L from "leaflet"
import geo, { Position } from "geojson"
import { Geometry, Feature} from "geojson"

import { deleteZone, sendZone } from "../../sensors/api/sensors-api";
import { FacilityDto, MapZoneDto, SensorGroupDto, SensorSectionDto, AlarmablePressureSensor, PressureSensorDto } from "../../interfaces/DtoInterfaces";
import SelectedSectionMenu from "./SelectedSectionMenu";
import AdvancedGeomanControls from "./AdvancedGeomanControls";
import { useNavigate } from "react-router-dom";
import { blueIcon, redIcon } from "./Icons";
import AlarmedSensorsMenu from "./AlarmedSensorsMenu";


interface FeatureLayer extends L.Layer{
  feature:Feature<Geometry, any>
}

interface SensorMarker{
  coordX:number,
  coordY:number,
  imei:string,
  measurement1:number,
  measurement2:number,
  isAlarmed:boolean
}

export interface ZoneProperties{
  name:string,
  id:number,
  sectionId:number
}

interface GeoJsonLayer extends L.Layer{
  toGeoJSON: () => GeoJSON.Feature;
}

function getCenter(coords:Position[]):Position{
  var centerX:number = 0
  var centerY:number = 0
  coords.forEach(point=>{
    centerX+=point.at(0) as number
    centerY+=point.at(1) as number
  })

  centerX /= coords.length
  centerY /= coords.length

  return [centerY, centerX]
}

interface DynamicSensorControlsProps{
  facility?:FacilityDto
  sensors?:AlarmablePressureSensor[]
  alarmedSensors?:AlarmablePressureSensor[]
}

export default function DynamicSensorControls({facility, sensors, alarmedSensors}:DynamicSensorControlsProps) {
  const [zones, setZones] = useState<MapZoneDto[]>([])
  const [sections, setSections] = useState<SensorSectionDto[]>([])
  const [groups, setGroups] = useState<SensorGroupDto[]>([])
  const [selectedSection, setSelectedSection] = useState<SensorSectionDto|null>(null)
  const [markers, setMarkers] = useState<SensorMarker[]>([])
  const mapSensorZoom:number = 15
  const map = useMap()
  const nav = useNavigate()

  const zoneCreateHandler = useCallback<L.PM.CreateEventHandler>(async (e)=>{
    if(e.layer instanceof L.Polygon && selectedSection){
      console.log('add-zone')
      const geoJsoLayer = e.layer as GeoJsonLayer
      var response = await sendZone({geometry:geoJsoLayer.toGeoJSON().geometry}, selectedSection.id)
      if(response.ok){
        var data = await response.json()
        setZones(prev=>[...prev, data])
      } 
    }
    e.layer.remove() 
  }, [selectedSection])

  useEffect(()=>{
    if(facility){
      setSections(facility.sections)
      setGroups(facility.groups)
    }
    else{
      setSections([])
      setGroups([])
    }
  }, [facility])

  useEffect(()=>{
    var markersBuffer:SensorMarker[] = []
        sensors && sensors.forEach(sensor=>{
          const coords:number[] = sensor.gps.split(' ').map(c=>Number(c))
          const cXBuffer:number|undefined = coords.at(0)
          const cYBuffer:number|undefined = coords.at(1)
          if(cXBuffer && cYBuffer){
            markersBuffer.push({coordX:cXBuffer, coordY:cYBuffer, imei:sensor.imei,
               measurement1:sensor.measurement1, measurement2:sensor.measurement2,
              isAlarmed:sensor.isAlarmed})
          }
        })
    setMarkers(markersBuffer)
  },[sensors])

  useEffect(()=>{
    const sectionsZones:MapZoneDto[] = []
    sections.forEach(section=>{
      if(section.zone){
        sectionsZones.push(section.zone)
      }})
    setZones(sectionsZones)
  }, [sections])

  function onZoneClick(zone:ZoneProperties){
    const zoneSection = sections.find(s=>s.id == zone.sectionId)
    if(zoneSection){
      setSelectedSection(zoneSection)

      ZoomToSection(zoneSection)
      console.log("Selected section:", zoneSection)
    }
  }

  function ZoomToSection(zoneSection:SensorSectionDto){
    const zoneGeometry = zoneSection.zone!.geometry as geo.Polygon
      const zoneCenter = getCenter(zoneGeometry.coordinates.at(0) as Position[])
      map.flyTo(zoneCenter as L.LatLngExpression, map.getZoom(), {
        duration:0.5
      })

  }

  function onSectionSelect(e:React.ChangeEvent<HTMLSelectElement>){
    const sectionId = Number(e.target.value)
    const zoneSection = sections.find(s=>s.id == sectionId)
    if(zoneSection){
      setSelectedSection(zoneSection)
      ZoomToSection(zoneSection)
    }
    else{
      setSelectedSection(null)
    }
    console.log("Selected section:", zoneSection)
  }

  const zoneRemoveHandler:L.PM.RemoveEventHandler = async (e)=>{
    if(e.layer instanceof L.Polygon){
      var featureLayer = e.layer as FeatureLayer
      var zoneId = featureLayer.feature.properties.id
      var response = await deleteZone(zoneId)
      if(response.ok){
        setZones(zones.filter(z=>z.id != zoneId))
      }
      else{
        console.error('Ошибка удаления зоны', response)
      }
    }
  }

  function flyToSensor(sensor:AlarmablePressureSensor | PressureSensorDto){
    const coordX:number = Number(sensor.gps.split(' ').at(0))
    const coordY:number = Number(sensor.gps.split(' ').at(1))
    map.flyTo([coordX, coordY], mapSensorZoom, {
      duration:0.5
    })
  }

  return (
     <>
     <FeatureGroup>
      <AdvancedGeomanControls
        zoneCreateHandler={zoneCreateHandler}
      >
      </AdvancedGeomanControls>

      {
        zones.map(zone=>{
          return (
            <GeoJSON 
            key={zone.id}
            data={zone.geometry}
            eventHandlers={{
                click: (e)=>onZoneClick(e.layer.feature.properties)
            }}
            onEachFeature={(_feature, layer)=>{
              var featureLayer = layer as FeatureLayer
              featureLayer.feature.properties = {id:zone.id, sectionId:zone.sectionId}

              layerEvents(layer, {
                onLayerRemove: async (e) => {
                  var zoneId = (e.layer as FeatureLayer).feature.properties.id
                  var response = await deleteZone(zoneId)
                  if(response.ok){
                    setZones(zones.filter(z=>z.id != zoneId))
                  }
                  else{
                    console.error('Ошибка удаления зоны', response)
                  }
                }
              }, 'on')
            }}
            >
            </GeoJSON>
          )
        })
      }

      {markers.map(marker => (
        <Marker key={marker.imei} position={[marker.coordX, marker.coordY]} icon={marker.isAlarmed? redIcon : blueIcon}>
          <Popup
            autoClose={false}
            autoPan={false}
            closeOnClick={false}
          >
            <p>Датчик: {marker.imei}</p>
            <p>Координаты: {marker.coordX}, {marker.coordY}</p>
            <fieldset>
              <legend>Измерения</legend>
              <p>Первый канал: {marker.measurement1}</p>
              <p>Второй канал: {marker.measurement2}</p>
            </fieldset>
            <button onClick={()=>nav(`/sensors/pressure/${marker.imei}`)}>Подробнее</button>
          </Popup>
        </Marker>
      ))}

     </FeatureGroup>
     <SelectedSectionMenu sections={sections} selectedSection={selectedSection} groups={groups} 
     onSectionSelect={onSectionSelect} onSensorSelect={flyToSensor}></SelectedSectionMenu>
      <AlarmedSensorsMenu alarmedSensors={alarmedSensors} onAlarmedSensorSelect={flyToSensor}></AlarmedSensorsMenu>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      /></>
  );
}
