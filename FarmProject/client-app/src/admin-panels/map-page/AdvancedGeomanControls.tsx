import { useEffect } from "react"
import L from "leaflet"
import { GeomanControls } from "react-leaflet-geoman-v2";
import { useMap } from "react-leaflet";

interface AdvancedGeomanControlsProps{
  zoneCreateHandler?:L.PM.CreateEventHandler
  id?:number
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
                options={{ 
                  position: 'topleft',
                  drawMarker:false,
                  drawPolyline:false,
                  drawRectangle:false,
                  drawCircle:false,
                  drawCircleMarker:false,
                  drawText:false,
                  dragMode:false,
                  cutPolygon:false,
                  rotateMode:false
                 }}
                globalOptions={{ continueDrawing: false }}
                onCreate={zoneCreateHandler}
        />
      )
}