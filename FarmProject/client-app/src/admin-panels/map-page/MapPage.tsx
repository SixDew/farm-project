import React, { useEffect, useState, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, FeatureGroup, useMap} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./SelectedZoneMenu.css"
import "leaflet-draw/dist/leaflet.draw.css";
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import { GeomanControls, layerEvents } from 'react-leaflet-geoman-v2';
import L, { marker } from "leaflet"
import {Geometry} from "geojson"
import { Feature } from "geojson";

import { deleteZone, getFacility, sendZone } from "../../sensors/api/sensors-api";
import { FacilityDto, MapZoneDto, SensorGroupDto, SensorSectionDto } from "../../interfaces/DtoInterfaces";
import SelectedSectionMenu from "./SelectedSectionMenu";

interface GeomanComponentProps{
  zones:MapZoneDto[]
  setZones:React.Dispatch<React.SetStateAction<MapZoneDto[]>>,
  onZoneClick:(zone:ZoneProperties)=>void
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

function GeomanComponent({zones, setZones, onZoneClick, markers}:GeomanComponentProps) {
  const map = useMap();
  useEffect(() => {
    const existingZoneId:number[] = []

    map.eachLayer(layer=>{
      const featureLayer = layer as FeatureLayer
      if(featureLayer.feature && featureLayer.feature.properties.id){
        existingZoneId.push(featureLayer.feature.properties.id)
      }
    })

    zones.forEach(zone => {
      if(!existingZoneId.find(id=>id == zone.id)){
        const geoJsonLayer = L.geoJSON(zone.geometry, {
          onEachFeature : (_feature, layer) =>{
            const featureLayer = layer as FeatureLayer
            featureLayer.feature.properties.id = zone.id
            featureLayer.feature.properties.sectionId = zone.sectionId
    
            layer.bindPopup(`Зона Id: ${featureLayer.feature.properties.id}`,
               {closeOnClick:true,
                autoPan:false
               })
    
            layer.on('mouseover', function (this:L.Layer) {
              this.openPopup()
            })
    
            layer.on('mouseout', function(this:L.Layer){
              this.closePopup()
            })

            layer.on('click',()=>{
              console.log('Zone click')
              onZoneClick(featureLayer.feature.properties)
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


export default function MapPage() {
  const [zones, setZones] = useState<MapZoneDto[]>([])
  const [facility, setFacility] = useState<FacilityDto>()
  const [sections, setSections] = useState<SensorSectionDto[]>([])
  const [groups, setGroups] = useState<SensorGroupDto[]>([])
  const [selectedZone, setSelectedZone] = useState<ZoneProperties|null>(null)
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
  }, [facility])

  useEffect(()=>{
    async function initFacilities() {
      const response = await getFacility(1)
      if(response.ok){
        const facilityData:FacilityDto = await response.json()
        console.log("Facility: ", facilityData)
        setFacility(facilityData)
      }
    }
    initFacilities()
  }, [])

  useEffect(()=>{
    var markersBuffer:SensorMarker[] = []
    sections.forEach(section=>{
        section.sensors.forEach(sensor=>{
          const coords:number[] = sensor.gps.split(' ').map(c=>Number(c))
          const cXBuffer:number|undefined = coords.at(0)
          const cYBuffer:number|undefined = coords.at(1)
          if(cXBuffer && cYBuffer){
            markersBuffer.push({coordX:cXBuffer, coordY:cYBuffer, imei:sensor.imei})
          }
        })
    })
    setMarkers(markersBuffer)
  },[sections])

  useEffect(()=>{
    const sectionsZones:MapZoneDto[] = []
    sections.forEach(section=>{
      if(section.zone){
        sectionsZones.push(section.zone)
      }})
    setZones(sectionsZones)
  }, [sections])

  function onZoneClick(zone:ZoneProperties){
    setSelectedZone(zone)

    const zoneSection = sections.find(s=>s.id == zone.sectionId)
    if(zoneSection){
      setSelectedSection(zoneSection)
      console.log("Selected section:", zoneSection)
    }
  }

  return (
    <MapContainer
      center={centerInit}
      zoom={zoomInit}
      style={{ height: "100%", width: "100%" }}
    >
     <GeomanComponent zones={zones} setZones={setZones} onZoneClick={onZoneClick} markers={markers}></GeomanComponent>
     <SelectedSectionMenu sections={sections} selectedZone={selectedZone} selectedSection={selectedSection} groups={groups}></SelectedSectionMenu>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}
