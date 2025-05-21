import {Geometry} from "geojson"

export interface PressureMeasurements{
    imei:string,
    measurement1:number,
    measurement2:number,
    measurementsTime:string
}

export interface PressureSensorSettingsDto{
    alarmActivated:boolean
    imei:string
    deviationSpanPositive?:number,
    deviationSpanNegative?:number,
    sensitivity?:number,
    firstSensorIsActive?:boolean,
    secondSensorIsActive?:boolean,
    dataSendingSpan?:number
}

export interface PressureSensorDto{
    imei:string,
    gps:string,
    measurements:PressureMeasurements[],
    settings:PressureSensorSettingsDto,
    facilityId:number
}

export interface PressureAlarmDto{
    id:number,
    measurement1:number,
    measurement2:number,
    isChecked:boolean,
    measurementsTime:string,
    imei:string
}

export interface SensorGroupDto{
    name:string,
    id:number,
    sensors:PressureSensorDto[]
}

export interface SensorGroupMetaDto{
    name:string,
    id:number,
}


export interface SensorSectionDto{
    name:string,
    sensors:PressureSensorDto[],
    id:number,
    zone:MapZoneDto | null
}

export interface SensorSectionMetaDto{
    name:string,
    id:number
}

export interface FacilityDto{
    name:string,
    sections:SensorSectionDto[],
    groups:SensorGroupDto[],
    id:number
}

export interface FacilityDeepMetaDto{
    name:string,
    sections:SensorSectionMetaDto[],
    groups:SensorGroupMetaDto[],
    id:number
}

export interface AdminUserDto{
    key:string,
    role:string,
    name:string,
    contactData:string,
    id:number,
    facilityId:number
}

export interface MapZoneDto{
    id:number,
    geometry:Geometry,
    sectionId:number
}

export interface AlarmablePressureSensor{
    imei:string,
    gps:string,
    lastMeasurement:PressureMeasurements|null
    isAlarmed:boolean,
    alarmedMeasurements:PressureAlarmDto[]
}

export interface DriftNotificationData{
    imei:string,
    warningInterval:string,
    measurementId:number
}