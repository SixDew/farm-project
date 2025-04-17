import React, { useEffect, useState, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, FeatureGroup, useMap} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./SelectedSectionMenu.css"
import "leaflet-draw/dist/leaflet.draw.css";
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import { GeomanControls, layerEvents } from 'react-leaflet-geoman-v2';
import L, { Polygon } from "leaflet"
import geo, { Position } from "geojson"
import {GeoJsonObject, Geometry} from "geojson"
import { Feature } from "geojson";

import { deleteZone, getFacility, sendZone } from "../../sensors/api/sensors-api";
import { FacilityDto, MapZoneDto, SensorGroupDto, SensorSectionDto, AlarmablePressureSensor } from "../../interfaces/DtoInterfaces";
import SelectedSectionMenu from "./SelectedSectionMenu";

interface GeomanComponentProps{
  zones:MapZoneDto[]
  setZones:React.Dispatch<React.SetStateAction<MapZoneDto[]>>,
  onZoneClick:(zone:ZoneProperties, map:L.Map)=>void
  markers:SensorMarker[]
}

interface FeatureLayer extends L.Layer{
  feature:Feature<Geometry, any>
}

interface SensorMarker{
  coordX:number,
  coordY:number,
  imei:string
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

function GeomanComponent({zones, setZones, onZoneClick, markers}:GeomanComponentProps) {
  const map = useMap();
  useEffect(() => {
    const existingZoneId:number[] = []

    map.eachLayer(layer=>{
      const featureLayer = layer as FeatureLayer
      if(featureLayer.feature && featureLayer.feature.properties.id){
        if(zones.find(zone=>zone.id == featureLayer.feature.properties.id )){
          existingZoneId.push(featureLayer.feature.properties.id)
        }
        else{
          featureLayer.remove()
        }
      }
    })

    zones.forEach(zone => {
      if(!existingZoneId.find(id=>id == zone.id)){
        const geoJsonLayer = L.geoJSON(zone.geometry, {
          onEachFeature : (_feature, layer) =>{
            const featureLayer = layer as FeatureLayer
            featureLayer.feature.properties.id = zone.id
            featureLayer.feature.properties.sectionId = zone.sectionId
    
            layer.on('click',()=>{
              console.log('Zone click')
              onZoneClick(featureLayer.feature.properties, map)
            })
  
            layer.on('pm:remove', async function(){
              var zoneId = featureLayer.feature.properties.id
              var response = await deleteZone(zoneId)
              if(response.ok){
                setZones(zones.filter(z=>z.id != zoneId))
              }
              else{
                console.error('Ошибка удаления зоны', response)
              }
            })
          }
        }).eachLayer((layer)=>{
          layerEvents(layer, {
            onEdit:(e) => console.log('Объект отредактирован:', e)
          }, 'on')
        });
        geoJsonLayer.addTo(map)     
      }
    });
  }, [map, zones]);

  useEffect(()=>{
    map.eachLayer(layer=>{
      if(layer instanceof L.Marker){
        layer.remove()
      }
    })
    markers.forEach(marker=>{
      const mapMarker = L.marker([marker.coordX, marker.coordY], {
        title:marker.imei
      })

      mapMarker.addTo(map)
    })
  }, [map,markers])


  const zoneCreateHandler = useCallback<L.PM.CreateEventHandler>(async (e)=>{
    if(e.layer instanceof L.Polygon){
      console.log('add-zone')
      const geoJsoLayer = e.layer as GeoJsonLayer
      var response = await sendZone({geometry:geoJsoLayer.toGeoJSON().geometry})
      if(response.ok){
        var data = await response.json()
        setZones(prev=>[...prev, data])
      }
      e.layer.remove()  
    }
  }, [])

  return (
    <FeatureGroup>
      <GeomanControls
        options={{ position: 'topleft' }}
        globalOptions={{ continueDrawing: false }}
        onCreate={zoneCreateHandler}
      />
    </FeatureGroup>
  );
}

interface MapPageProps{
  facility?:FacilityDto
  sensors?:AlarmablePressureSensor[]
}

export default function MapPage({facility, sensors}:MapPageProps) {
  const [zones, setZones] = useState<MapZoneDto[]>([])
  const [sections, setSections] = useState<SensorSectionDto[]>([])
  const [groups, setGroups] = useState<SensorGroupDto[]>([])
  const [selectedSection, setSelectedSection] = useState<SensorSectionDto|null>(null)
  const [markers, setMarkers] = useState<SensorMarker[]>([])
  const centerInit = useMemo<L.LatLngExpression>(()=>{
    return [55.75, 37.61]
  }, [])
  const zoomInit = useMemo<number>(()=>{
    return 13
  },[])

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
            markersBuffer.push({coordX:cXBuffer, coordY:cYBuffer, imei:sensor.imei})
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

  function onZoneClick(zone:ZoneProperties, map:L.Map){
    const zoneSection = sections.find(s=>s.id == zone.sectionId)
    if(zoneSection){
      setSelectedSection(zoneSection)

      ZoomToSection(zoneSection, map)
      console.log("Selected section:", zoneSection)
    }
  }

  function ZoomToSection(zoneSection:SensorSectionDto, map:L.Map){
    const zoneGeometry = zoneSection.zone!.geometry as geo.Polygon
      const zoneCenter = getCenter(zoneGeometry.coordinates.at(0) as Position[])
      map.flyTo(zoneCenter as L.LatLngExpression, map.getZoom(), {
        duration:0.5
      })

  }

  function onSectionSelect(e:React.ChangeEvent<HTMLSelectElement>, map:L.Map){
    const sectionId = Number(e.target.value)
    const zoneSection = sections.find(s=>s.id == sectionId)
    if(zoneSection){
      setSelectedSection(zoneSection)
      ZoomToSection(zoneSection, map)
      console.log("Selected section:", zoneSection)
    }
    else{
      setSelectedSection(null)
    }
  }

  return (
    <MapContainer
      center={centerInit}
      zoom={zoomInit}
      style={{height:"100%", width: "100%" }}
    >
     <GeomanComponent zones={zones} setZones={setZones} onZoneClick={onZoneClick} markers={markers}></GeomanComponent>
     <SelectedSectionMenu sections={sections} selectedSection={selectedSection} groups={groups} onSectionSelect={onSectionSelect}></SelectedSectionMenu>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}
