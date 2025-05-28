import { useEffect, useRef, useState } from 'react'
import './EditGroupDialog.css'
import { AlarmablePressureSensor, PressureSensorDto, SensorGroupDto, SensorGroupMetaDto } from '../../interfaces/DtoInterfaces'
import SensorInfoElement from './SensorInfoElement'
import { changeGroupMetadata, deleteGroup, sendGroupChangeList } from '../../sensors/api/sensors-api'
import Dialog from './Dialog'
import { useAuth } from '../../AuthProvider'

interface EditGroupDialogProps{
    isOpen:boolean
    group:SensorGroupDto
    sensors:PressureSensorDto[] | AlarmablePressureSensor[]
    disabledSensors:PressureSensorDto[]
    onEnd?:()=>void
    onGroupChange?:(group:SensorGroupDto)=>void
    onGroupMetadataChange?:(groupMetadata:SensorGroupMetaDto)=>void
    onGroupDeleted?:(group:SensorGroupDto | SensorGroupMetaDto)=>void
}

export default function EditGroupDialog({isOpen, onEnd, group, sensors, disabledSensors, onGroupChange, onGroupDeleted, onGroupMetadataChange}:EditGroupDialogProps){
    const [sensorsImeiToAdd, setSensorImeiToAdd] = useState<string[]>([])
    const [groupName, setGroupName] = useState(group.name)
    const [nameChangeMod, setNameChangeMod] = useState(false)
    const authContext = useAuth()

    const groupNameInput = useRef<HTMLInputElement>(null)

    useEffect(()=>{
        setGroupName(group.name)
    }, [group.name])

    async function changeGroupSensorList(){
        const response = await authContext.sendWithAccessCheck(()=>sendGroupChangeList(group.id, sensorsImeiToAdd))
        if(response.ok){
            const group:SensorGroupDto = await response.json()
            onGroupChange && onGroupChange(group)
        }
    }

    function keyDawnHandler(e:React.KeyboardEvent<HTMLInputElement>) {
        if(e.key === 'Enter'){
            setNameChangeMod(false)
        }
    }

    async function onEndEdit() {
        await changeGroupMetadataAsync()
        await changeGroupSensorList()
    }

    async function changeGroupMetadataAsync(){
            if(group.name != groupName){
                const response = await authContext.sendWithAccessCheck(()=>changeGroupMetadata(group.id, groupName))
                if(response.ok){
                    onGroupMetadataChange && onGroupMetadataChange(await response.json())
                }
            }
        }

    async function deleteGroupAsync() {
        const response = await authContext.sendWithAccessCheck(()=>deleteGroup(group.id))
        if(response.ok){
            const group:SensorGroupMetaDto = await response.json()
            onGroupDeleted && onGroupDeleted(group)
        }
    }

    useEffect(()=>{
        setSensorImeiToAdd(group.sensors.map(s=>s.imei))
    }, [group])

    return (
        <Dialog 
        isOpen={isOpen} 
        endButtonTitle='Принять'
        onEnd={()=>{
            onEndEdit()
            onEnd && onEnd()
        }}
        >
            <div className='dialog-group-name-container'>
                {
                    nameChangeMod? <>
                            <input type='text' ref={groupNameInput} value={groupName}
                            onChange={(e)=>setGroupName(e.target.value)}
                            onKeyDown={keyDawnHandler}
                        ></input>
                        <button
                            onClick={()=>setNameChangeMod(false)}
                        >Ок</button>
                        </> : <>
                            <h3
                                onClick={()=>setNameChangeMod(true)}
                            >{groupName}</h3>
                            <button className='dialog-group-delete-button' onClick={()=>{
                                deleteGroupAsync()
                                onEnd && onEnd()
                            }}>Удалить
                            </button>
                        </>
                }
            </div>
            {
                <div className='dialog-group-sensors-container'>
                    {
                        sensors.filter(s=>!disabledSensors.find(ds=>ds.imei == s.imei)).map(sensor=>
                            <div key={sensor.imei} className={sensorsImeiToAdd?.includes(sensor.imei) ? 'selcted-dialog-sensor-container' : 'dialog-sensor-container'} onClick={()=>{
                                if(sensorsImeiToAdd.includes(sensor.imei)){
                                    setSensorImeiToAdd([...sensorsImeiToAdd.filter(imei=>imei != sensor.imei)])
                                }
                                else{
                                    sensorsImeiToAdd.push(sensor.imei)
                                    setSensorImeiToAdd([...sensorsImeiToAdd])
                                }
                            }}>
                                <SensorInfoElement sensor={sensor}/>
                            </div>
                        )
                    }
                </div>
            }
        </Dialog>
    )
}