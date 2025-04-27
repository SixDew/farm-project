import { useEffect, useRef, useState } from 'react'
import { AlarmablePressureSensor, PressureSensorDto, SensorSectionDto, SensorSectionMetaDto } from '../../interfaces/DtoInterfaces'
import Dialog from './Dialog'
import './EditSectionDialog.css'
import SensorInfoElement from './SensorInfoElement'
import { changeSectionMetadata, deleteSection } from '../../sensors/api/sensors-api'

interface EditSectionDialogProps{
    isOpen:boolean,
    section:SensorSectionDto,
    onEnd?:()=>void
    onSectionChange?:(sectionMeta:SensorSectionMetaDto)=>void,
    onSectionDelete?:(section:SensorSectionDto)=>void
}

export default function EditSectionDialog({isOpen, section, onEnd, onSectionChange, onSectionDelete}:EditSectionDialogProps){
    const sectionNameInput = useRef<HTMLInputElement>(null)
    const [sectionName, setSectionName] = useState(section.name)
    const [nameChangeMod, setNameChangeMod] = useState(false)

    useEffect(()=>{
        setSectionName(section.name)
    }, [section.name])

    async function changeSectionMetadataAsync(){
        if(section.name != sectionName){
            const response = await changeSectionMetadata(section.id, sectionName)
            if(response.ok){
                onSectionChange && onSectionChange(await response.json())
            }
        }
    }

    function keyDawnHandler(e:React.KeyboardEvent<HTMLInputElement>) {
        if(e.key === 'Enter'){
            setNameChangeMod(false)
        }
    }

    async function sectionDelete(){
        const response = await deleteSection(section.id)
        if(response.ok){
            onSectionDelete && onSectionDelete(await response.json())
            onEnd && onEnd()
        }
    }

    useEffect(()=>{
        if(nameChangeMod && sectionNameInput && sectionNameInput.current){
            sectionNameInput.current.focus()
        }
    }, [nameChangeMod])

    return(
        <Dialog
            isOpen={isOpen}
            endButtonTitle='Принять'
            onEnd={()=>{
                changeSectionMetadataAsync()
                onEnd && onEnd()
            }}
        >
            <div className='dialog-section-name-container'>
                {
                    nameChangeMod? <>
                        <input type='text' ref={sectionNameInput} value={sectionName}
                        onChange={(e)=>setSectionName(e.target.value)}
                        onKeyDown={keyDawnHandler}
                    ></input>
                    <button
                        onClick={()=>setNameChangeMod(false)}
                    >Ок</button>
                    </> : <>
                        <h3
                            onClick={()=>setNameChangeMod(true)}
                        >{sectionName}</h3>
                        <button className='dialog-section-delete-button' onClick={()=>{
                            sectionDelete()
                            onEnd && onEnd()
                        }}>Удалить
                        </button>
                    </>
                }
            </div>
            {
                <div className='dialog-section-sensors-container'>
                    {
                        section.sensors.map(sensor=>
                            <div key={sensor.imei} className='dialog-sensor-container'>
                                <SensorInfoElement sensor={sensor}/>
                            </div>
                        )
                    }
                </div>
            }
        </Dialog>
    )
}