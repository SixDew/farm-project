// import { useEffect, useRef, useState } from 'react'
// import './SensorAddDialog.css'
// import { AlarmablePressureSensor, PressureSensorDto, SensorGroupDto } from '../../interfaces/DtoInterfaces'
// import SensorInfoElement from './SensorInfoElement'
// import { sendGroupChangeList } from '../../sensors/api/sensors-api'

// interface SensorAddDialogProps{
//     isOpen:boolean
//     group:SensorGroupDto
//     sensors:PressureSensorDto[] | AlarmablePressureSensor[]
//     onEnd?:()=>void
//     onGroupChange?:(group:SensorGroupDto)=>void
// }

// export default function SensorAddDialog({isOpen, onEnd, group, sensors, onGroupChange}:SensorAddDialogProps){
//     const addSensorDialog = useRef<HTMLDialogElement>(null)
//     const [sensorsImeiToAdd, setSensorImeiToAdd] = useState<string[]>([])

//     async function changeGroupSensorList(){
//         const response = await sendGroupChangeList(group.id, sensorsImeiToAdd)
//         if(response.ok){
//             const group:SensorGroupDto = await response.json()
//             onGroupChange && onGroupChange(group)
//         }
//     }

//     useEffect(()=>{
//         if(addSensorDialog && addSensorDialog.current){
//             if(isOpen){
//                 addSensorDialog.current.showModal()
//             }   
//             else{
//                 addSensorDialog.current.close()
//             }
//         }
//     }, [isOpen])

//     useEffect(()=>{
//         const buffImeis:string[] = []
//         group.sensors.forEach(s=>buffImeis.push(s.imei))
//         setSensorImeiToAdd(buffImeis)
//     }, [group])

//     return (
//         <dialog ref={addSensorDialog} className="add-sensor-dialog">
//             <h3>{group.name}</h3>
//             {
//                 <div className='dialog-group-sensors-container'>
//                     {
//                         sensors.map(sensor=>
//                             <div key={sensor.imei} className={sensorsImeiToAdd?.includes(sensor.imei) ? 'selcted-dialog-sensor-container' : 'dialog-sensor-container'} onClick={()=>{
//                                 if(sensorsImeiToAdd.includes(sensor.imei)){
//                                     setSensorImeiToAdd([...sensorsImeiToAdd.filter(imei=>imei != sensor.imei)])
//                                 }
//                                 else{
//                                     sensorsImeiToAdd.push(sensor.imei)
//                                     setSensorImeiToAdd([...sensorsImeiToAdd])
//                                 }
//                             }}>
//                                 <SensorInfoElement sensor={sensor}/>
//                             </div>
//                         )
//                     }
//                 </div>
//             }
//             <button onClick={()=>{
//                 changeGroupSensorList()
//                 onEnd && onEnd()
//             }}>Принять</button>
//         </dialog>
//     )
// }

import { useEffect, useRef, useState } from 'react'
import './SensorAddDialog.css'
import { AlarmablePressureSensor, PressureSensorDto, SensorGroupDto, SensorGroupMetaDto } from '../../interfaces/DtoInterfaces'
import SensorInfoElement from './SensorInfoElement'
import { deleteGroup, sendGroupChangeList } from '../../sensors/api/sensors-api'
import Dialog from './Dialog'

interface SensorAddDialogProps{
    isOpen:boolean
    group:SensorGroupDto
    sensors:PressureSensorDto[] | AlarmablePressureSensor[]
    onEnd?:()=>void
    onGroupChange?:(group:SensorGroupDto)=>void
    onGroupDeleted?:(group:SensorGroupDto | SensorGroupMetaDto)=>void
}

export default function SensorAddDialog({isOpen, onEnd, group, sensors, onGroupChange, onGroupDeleted}:SensorAddDialogProps){
    const [sensorsImeiToAdd, setSensorImeiToAdd] = useState<string[]>([])

    async function changeGroupSensorList(){
        const response = await sendGroupChangeList(group.id, sensorsImeiToAdd)
        if(response.ok){
            const group:SensorGroupDto = await response.json()
            onGroupChange && onGroupChange(group)
        }
    }

    async function deleteGroupAsync() {
        const response = await deleteGroup(group.id)
        if(response.ok){
            const group:SensorGroupMetaDto = await response.json()
            onGroupDeleted && onGroupDeleted(group)
        }
    }

    useEffect(()=>{
        const buffImeis:string[] = []
        group.sensors.forEach(s=>buffImeis.push(s.imei))
        setSensorImeiToAdd(buffImeis)
    }, [group])

    return (
        <Dialog 
        isOpen={isOpen} 
        endButtonTitle='Принять'
        onEnd={()=>{
            changeGroupSensorList()
            onEnd && onEnd()
        }}
        >
            <div className='dialog-group-name-container'>
                <h3>{group.name}</h3>
                <button className='dialog-group-delete-button' onClick={()=>{
                    deleteGroupAsync()
                    onEnd && onEnd()
                }}>Удалить
                </button>
            </div>
            {
                <div className='dialog-group-sensors-container'>
                    {
                        sensors.map(sensor=>
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