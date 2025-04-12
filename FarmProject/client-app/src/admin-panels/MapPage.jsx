import React, { useEffect, useState, useRef, useCallback } from "react";
import { MapContainer, TileLayer, FeatureGroup, useMap} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./SelectedZoneMenu.css"
import "leaflet-draw/dist/leaflet.draw.css";
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import { GeomanControls, layerEvents } from 'react-leaflet-geoman-v2';

import { deleteZone, getZones, sendZone } from "../sensors/api/sensors-api";
import Control from "react-leaflet-custom-control";


function GeomanComponent({zones, setZones, onZoneClick}) {
  const map = useMap();
  useEffect(() => {
    console.log(zones)
    const existingZoneId = []

    map.eachLayer(layer=>{
      if(layer.feature && layer.feature.properties.id){
        existingZoneId.push(layer.feature.properties.id)
      }
    })

    zones.forEach(zone => {
      if(!existingZoneId.find(id=>id == zone.id)){
        const geoJsonLayer = L.geoJSON(zone.geometry, {
          onEachFeature : (feature, layer) =>{
            layer.feature.properties.name = zone.name
            layer.feature.properties.id = zone.id
    
            layer.bindPopup(`Зона: ${layer.feature.properties.name} Id: ${layer.feature.properties.id}`, {closeOnClick:true})
    
            layer.on('mouseover', function () {
              this.openPopup()
            })
    
            layer.on('mouseout', function(){
              this.closePopup()
            })

            layer.on('click',()=>{
              console.log('Zone click')
              onZoneClick(layer.feature.properties)
            })
  
            layer.on('pm:remove', async function(){
              var zoneId = layer.feature.properties.id
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

  const zoneCreateHandler = useCallback(async (e)=>{
    console.log('add-zone')
    var response = await sendZone({name:"test-zone", geometry:e.layer.toGeoJSON().geometry})
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

function SelectedZoneMenu({name, id}){
  return (
    <div className="selected-zone-menu">
      <h3>Зона: {name}</h3>
      <h3>Id: {id}</h3>
    </div>
  )
}


export default function MapPage() {
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null)

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

  function onZoneClick(zone){
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
