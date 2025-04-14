import React, { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, FeatureGroup, useMap} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./SelectedZoneMenu.css"
import "leaflet-draw/dist/leaflet.draw.css";
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import { GeomanControls, layerEvents } from 'react-leaflet-geoman-v2';
import L from "leaflet"
import {Geometry} from "geojson"
import { Feature } from "geojson";

import { deleteZone, getZones, sendZone } from "../sensors/api/sensors-api";
import Control from "react-leaflet-custom-control";
import { MapZoneDto } from "../interfaces/DtoInterfaces";

interface GeomanComponentProps{
  zones:MapZoneDto[]
  setZones:React.Dispatch<React.SetStateAction<MapZoneDto[]>>,
  onZoneClick:(zone:ZoneProperties)=>void
}

interface FeatureLayer extends L.Layer{
  feature:Feature<Geometry, any>
}

interface ZoneProperties{
  name:string,
  id:number
}

interface GeoJsonLayer extends L.Layer{
  toGeoJSON: () => GeoJSON.Feature;
}

function GeomanComponent({zones, setZones, onZoneClick}:GeomanComponentProps) {
  const map = useMap();
  useEffect(() => {
    console.log(zones)
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
            featureLayer.feature.properties.name = zone.name
            featureLayer.feature.properties.id = zone.id
    
            layer.bindPopup(`Зона: ${featureLayer.feature.properties.name} Id: ${featureLayer.feature.properties.id}`, {closeOnClick:true})
    
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


  const zoneCreateHandler = useCallback<L.PM.CreateEventHandler>(async (e)=>{
    console.log('add-zone')
    const geoJsoLayer = e.layer as GeoJsonLayer
    var response = await sendZone({name:"test-zone", geometry:geoJsoLayer.toGeoJSON().geometry})
    if(response.ok){
      var data = await response.json()
      setZones(prev=>[...prev, data])
    }
    e.layer.remove()
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
  const [zones, setZones] = useState<MapZoneDto[]>([]);
  const [selectedZone, setSelectedZone] = useState<ZoneProperties|null>(null)

  useEffect(() => {
    async function getAllZones() {
      const response = await getZones();
      if (response.ok) {
        const data = await response.json();
        setZones(data);
      }
    }
    getAllZones();
  }, []);

  function onZoneClick(zone:ZoneProperties){
    setSelectedZone(zone)
  }

  return (
    <MapContainer
      center={[55.75, 37.61]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
     <GeomanComponent zones={zones} setZones={setZones} onZoneClick={onZoneClick}></GeomanComponent>
     {
      selectedZone && (
        <Control prepend position="topright">
          <div className="selected-zone-menu">
            <h3>Зона: {selectedZone.name}</h3>
            <h3>Id: {selectedZone.id}</h3>
          </div>
        </Control>
      )
     }
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}
