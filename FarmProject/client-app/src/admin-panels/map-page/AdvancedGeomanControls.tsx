import { useCallback } from "react"
import { MapZoneDto, SensorSectionDto } from "../../interfaces/DtoInterfaces"
import L from "leaflet"
import { sendZone } from "../../sensors/api/sensors-api";
import { GeomanControls } from "react-leaflet-geoman-v2";

interface AdvancedGeomanControlsProps{
  zoneCreateHandler?:L.PM.CreateEventHandler
}

interface GeoJsonLayer extends L.Layer{
  toGeoJSON: () => GeoJSON.Feature;
}

export default function AdvancedGeomanControls({zoneCreateHandler}:AdvancedGeomanControlsProps) {
      return (
        <GeomanControls
                options={{ position: 'topleft' }}
                globalOptions={{ continueDrawing: false }}
                onCreate={zoneCreateHandler}
        />
      )
}