import { useCallback, useEffect } from "react"
import { MapZoneDto, SensorSectionDto } from "../../interfaces/DtoInterfaces"
import L from "leaflet"
import { sendZone } from "../../sensors/api/sensors-api";
import { GeomanControls } from "react-leaflet-geoman-v2";
import { useMap } from "react-leaflet";

interface AdvancedGeomanControlsProps{
  zoneCreateHandler?:L.PM.CreateEventHandler
  id?:number
}

interface GeoJsonLayer extends L.Layer{
  toGeoJSON: () => GeoJSON.Feature;
}

export default function AdvancedGeomanControls({zoneCreateHandler,id}:AdvancedGeomanControlsProps) {
      const map = useMap()
      useEffect(()=>{
        console.log('create event change', zoneCreateHandler)
        map.off('pm:create')
      }, [zoneCreateHandler])
      return (
        <GeomanControls
                key={id}
                options={{ position: 'topleft' }}
                globalOptions={{ continueDrawing: false }}
                onCreate={zoneCreateHandler}
        />
      )
}