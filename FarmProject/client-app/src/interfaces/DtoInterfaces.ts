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
    settings:PressureSensorSettingsDto
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
    metadata:SensorGroupMetadataDto,
    id:number,
    sensors:PressureSensorDto[]
}

export interface SensorGroupDeepMetaDto{
    metadata:SensorGroupMetadataDto,
    id:number,
}

export interface SensorGroupMetadataDto{
    name:string,
    description:string
}

export interface SensorSectionMetadataDto{
    name:string
}

export interface SensorSectionDto{
    metadata:SensorSectionMetadataDto,
    groups:SensorGroupDto[],
    id:number,
    zone:MapZoneDto | null
}

export interface SensorSectionDeepMetaDto{
    metadata:SensorSectionMetadataDto,
    groupsMetadata:SensorGroupDeepMetaDto[],
    id:number
}

export interface AdminUserDto{
    key:string,
    role:string,
    name:string,
    phone:string,
    id:number
}

export interface MapZoneDto{
    id:number,
    name:string,
    geometry:Geometry,
    sectionId:number
}