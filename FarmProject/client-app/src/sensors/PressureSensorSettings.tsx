import { useEffect, useState } from 'react'
import './PressureSensorSettings.css'
import { getPressureSettings, updatePressureSettings, getAdminPressureSettings, updateAdminPressureSettings, setSensorActive } from './api/sensors-api'
import SettingsMenuNumElemet from './SettingsMenuNumElement'
import SettingsMenuBoolElemet from './SettingsMenuBoolElemet'
import { useNavigate } from 'react-router-dom'
import { PressureSensorSettingsDto } from '../interfaces/DtoInterfaces'
import '../main-style.css'

import saveImage from '../images/save.png'
import disableImage from '../images/white-disabled2.png'
import { useAuth } from '../AuthProvider'
 
interface PressureSensorSettingProps{
    imei:string,
    role:string,
    onDisableSensor?:()=>void
}

export default function PressureSensorSettings({imei, role, onDisableSensor}:PressureSensorSettingProps){
    const [settings, setSettings] = useState<PressureSensorSettingsDto | null>(null)
    const [showSaveOkMessage, setShowSaveOkMessage] = useState<boolean>(false)
    const [showSaveErrorMessage, setShowSaveErrorMessage] = useState<boolean>(false)
    const nav = useNavigate()
    const authContext = useAuth()

    async function saveSettings(){
        const response = await authContext.sendWithAccessCheck(()=>updatePressureSettings(imei, settings))
        .catch((err)=>{
            console.error('Update setting error', err)
            setShowSaveErrorMessage(true)
        })
        if(response && response.ok){
            setShowSaveOkMessage(true)
        }
        else{
            setShowSaveErrorMessage(false)
        }
    }

    async function saveAdminSettings() {
        const response = await authContext.sendWithAccessCheck(()=>updateAdminPressureSettings(imei, settings))
        .catch((err)=>{
            console.error('Update setting error', err)
            setShowSaveErrorMessage(true)
        })
        if(response && response.ok){
            setShowSaveOkMessage(true)
        }
        else{
            setShowSaveErrorMessage(false)
        }
    }

    useEffect(()=>{
        async function getSettings(){
            if(!settings){
                const response = await authContext.sendWithAccessCheck(()=>getPressureSettings(imei))
                if(response.ok){
                    const settingsData:PressureSensorSettingsDto = await response.json()
                    setSettings(settingsData)
                }
            }
        }

        async function getAdminSettings() {
            if(!settings){
                const response = await authContext.sendWithAccessCheck(()=>getAdminPressureSettings(imei))
                if(response.ok){
                    const settingsData:PressureSensorSettingsDto = await response.json()
                    setSettings(settingsData)
                }
            }
        }

        if(role === 'admin'){
            getAdminSettings()
        }
        if(role === 'user'){
            getSettings()
        }
    },[])

    useEffect(()=>{
        setShowSaveOkMessage(false)
        setShowSaveErrorMessage(false)
    }, [settings])

    return(
        <div id='main-settings-container'>
            <h3>Настройки</h3>
            {
                settings ? (
                    <>
                    {
                        role === 'admin' && (
                            <>
                                <SettingsMenuNumElemet className='setting-input-field' title='Позитивное отклонение' value={settings.deviationSpanPositive as number} changeEvent={(event)=>{setSettings((prev)=>{
                                        if(prev){
                                            prev.deviationSpanPositive=Number(event.target.value)
                                            return {...prev}
                                        }else{
                                            return null
                                        }
                                })}}/>
                                <SettingsMenuNumElemet className='setting-input-field' title='Негативное отклонение' value={settings.deviationSpanNegative as number} changeEvent={(event)=>{setSettings((prev)=>{
                                        if(prev){
                                            prev.deviationSpanNegative=Number(event.target.value)
                                            return {...prev}
                                        }
                                        else{
                                            return null
                                        }
                                })}}/>
                                <SettingsMenuNumElemet className='setting-input-field' title='Чувствительность' value={settings.sensitivity as number} changeEvent={(event)=>{setSettings((prev)=>{
                                        if(prev){
                                            prev.sensitivity=Number(event.target.value)
                                            return {...prev}
                                        }
                                        else{
                                            return null
                                        }
                                })}}/>
                                <SettingsMenuNumElemet className='setting-input-field' title='Частота отправки данных' value={settings.dataSendingSpan as number} changeEvent={(event)=>{
                                    setSettings((prev)=>{
                                        if(prev){
                                            prev.dataSendingSpan=Number(event.target.value)
                                            return {...prev}
                                        }
                                        else{
                                            return null
                                        }
                                })}}/>
                                <SettingsMenuBoolElemet title='Отправка предупреждений' value={settings.alarmActivated} changeEvent={(event)=>{
                                    setSettings((prev)=>{
                                        if(prev){
                                            prev.alarmActivated = event.target.checked
                                            return {...prev}
                                        }
                                        else{
                                            return null
                                        }
                                    })
                                }}/>
                                <SettingsMenuBoolElemet title='Первый канал' value={settings.firstSensorIsActive as boolean} changeEvent={(event)=>{
                                    setSettings((prev)=>{
                                        if(prev){
                                            prev.firstSensorIsActive = event.target.checked
                                            return {...prev}
                                        }
                                        else{
                                            return null
                                        }
                                    })
                                }}/>
                                <SettingsMenuBoolElemet title='Второй канал' value={settings.secondSensorIsActive as boolean} changeEvent={(event)=>{
                                    setSettings((prev)=>{
                                        if(prev){
                                            prev.secondSensorIsActive = event.target.checked
                                            return {...prev}
                                        }
                                        else{
                                            return null
                                        }
                                    })
                                }}/>

                                {showSaveOkMessage && <p className='ok-message'>Настройки успешно сохранены</p>}
                                {showSaveErrorMessage && <p className='error-message'>Ошибка сохранения настроек</p>}
                                <div className='setting-button-container'>
                                    <button className='standart-button' onClick={saveAdminSettings}><img src={saveImage} width="32px" height="32px"></img></button>
                                    <button className='standart-button delete' onClick={async ()=>{
                                        const response = await authContext.sendWithAccessCheck(()=>setSensorActive(false, imei))
                                        if(response.ok){
                                            onDisableSensor && onDisableSensor()
                                            if(authContext.role == 'admin'){
                                                nav('/sensors-to-add')
                                            }
                                        }
                                    }}><img src={disableImage} width="32px" height="32px"></img></button>
                                </div>
                            </>
                        )
                    }
                    {
                        role === 'user' && (
                            <>
                                <SettingsMenuBoolElemet title='Отправка предупреждений' value={settings.alarmActivated} changeEvent={(event)=>{
                                    setSettings((prev)=>{
                                        if(prev){
                                            prev.alarmActivated = event.target.checked
                                            return {...prev}
                                        }
                                        else{
                                            return null
                                        }
                                    })
                                }}/>
                                {showSaveOkMessage && <p className='ok-message'>Настройки успешно сохранены</p>}
                                {showSaveErrorMessage && <p className='error-message'>Ошибка сохранения настроек</p>}
                                <button className='standart-button' onClick={saveSettings}><img src={saveImage} width="32px" height="32px"></img></button>
                            </>
                        )
                    }
                    </>
                ) : (<p>Loading</p>)
            }
        </div>
    )
}