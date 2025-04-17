import React, { useEffect, useState, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, FeatureGroup, useMap, GeoJSON, Marker, Tooltip} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./SelectedSectionMenu.css"
import "leaflet-draw/dist/leaflet.draw.css";
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import { GeomanControls, layerEvents } from 'react-leaflet-geoman-v2';
import L from "leaflet"
import geo, { Position } from "geojson"
import { Geometry, Feature} from "geojson"

import { deleteZone, sendZone } from "../../sensors/api/sensors-api";
import { FacilityDto, MapZoneDto, SensorGroupDto, SensorSectionDto, AlarmablePressureSensor } from "../../interfaces/DtoInterfaces";
import SelectedSectionMenu from "./SelectedSectionMenu";
import AdvancedGeomanControls from "./AdvancedGeomanControls";
import DynamicSensorControls from "./DynamicSensorControls";

interface GeomanComponentProps{
  zones:MapZoneDto[]
  setZones:React.Dispatch<React.SetStateAction<MapZoneDto[]>>,
  onZoneClick:(zone:ZoneProperties, map:L.Map)=>void
  markers:SensorMarker[]
  selectedSection:SensorSectionDto|null
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

interface MapPageProps{
  facility?:FacilityDto
  sensors?:AlarmablePressureSensor[]
}

export default function MapPage({facility, sensors}:MapPageProps) {
  const centerInit = useMemo<L.LatLngExpression>(()=>{
    return [55.75, 37.61]
  }, [])
  const zoomInit = useMemo<number>(()=>{
    return 13
  },[])
  return (
    <MapContainer
      center={centerInit}
      zoom={zoomInit}
      style={{height:"100%", width: "100%" }}
    >
     <DynamicSensorControls facility={facility} sensors={sensors}></DynamicSensorControls>
    </MapContainer>
  );
}
