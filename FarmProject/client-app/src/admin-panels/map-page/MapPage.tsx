import { useMemo } from "react";
import { MapContainer} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./SelectedSectionMenu.css"
import "leaflet-draw/dist/leaflet.draw.css";
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import L from "leaflet";
import '../../main-style.css';

import { FacilityDto, AlarmablePressureSensor } from "../../interfaces/DtoInterfaces";
import DynamicSensorControls from "./DynamicSensorControls";
import PageContentBase from "../../PageContentBase";

export interface ZoneProperties{
  name:string,
  id:number,
  sectionId:number
}

interface MapPageProps{
  facility?:FacilityDto
  sensors?:AlarmablePressureSensor[],
  alarmedSenosrs?:AlarmablePressureSensor[]
}

export default function MapPage({facility, sensors, alarmedSenosrs}:MapPageProps) {
  const centerInit = useMemo<L.LatLngExpression>(()=>{
    return [55.75, 37.61]
  }, [])
  const zoomInit = useMemo<number>(()=>{
    return 13
  },[])
  return (
    <PageContentBase title="Карта">
      <MapContainer
        center={centerInit}
        zoom={zoomInit}
        style={{height:"100%", width: "100%", zIndex:1 }}
        closePopupOnClick={false}
      >
      <DynamicSensorControls facility={facility} sensors={sensors} alarmedSensors={alarmedSenosrs}></DynamicSensorControls>
      </MapContainer>
    </PageContentBase>
  );
}
