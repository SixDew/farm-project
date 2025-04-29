import { useEffect, useState } from 'react'
import './PressureSensorSettings.css'
import { getPressureSettings, updatePressureSettings, getAdminPressureSettings, updateAdminPressureSettings, setSensorActive } from './api/sensors-api'
import SettingsMenuNumElemet from './SettingsMenuNumElement'
import SettingsMenuBoolElemet from './SettingsMenuBoolElemet'
import { useNavigate } from 'react-router-dom'
import { PressureSensorSettingsDto } from '../interfaces/DtoInterfaces'
 
interface PressureSensorSettingProps{
    imei:string,
    role:string
}

export default function PressureSensorSettings({imei, role}:PressureSensorSettingProps){
    const [settings, setSettings] = useState<PressureSensorSettingsDto | null>(null)
    const [showSaveOkMessage, setShowSaveOkMessage] = useState<boolean>(false)
    const [showSaveErrorMessage, setShowSaveErrorMessage] = useState<boolean>(false)
    const nav = useNavigate()

    async function saveSettings(){
        const response = await updatePressureSettings(imei, settings)
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
        const response = await updateAdminPressureSettings(imei, settings)
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
                const response = await getPressureSettings(imei)
                if(response.status === 401){
                    nav('/login')
                }
                if(response.ok){
                    const settingsData:PressureSensorSettingsDto = await response.json()
                    setSettings(settingsData)
                }
            }
        }

        async function getAdminSettings() {
            if(!settings){
                const response = await getAdminPressureSettings(imei)
                if(response.status === 401){
                    nav('/login')
                }
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
            {
                settings ? (
                    <>
                    {
                        role === 'admin' && (
                            <>
                                <SettingsMenuNumElemet title='Позитивное отклонение' value={settings.deviationSpanPositive as number} changeEvent={(event)=>{setSettings((prev)=>{
                                        if(prev){
                                            prev.deviationSpanPositive=Number(event.target.value)
                                            return {...prev}
                                        }else{
                                            return null
                                        }
                                })}}/>
                                <SettingsMenuNumElemet title='Негативное отклонение' value={settings.deviationSpanNegative as number} changeEvent={(event)=>{setSettings((prev)=>{
                                        if(prev){
                                            prev.deviationSpanNegative=Number(event.target.value)
                                            return {...prev}
                                        }
                                        else{
                                            return null
                                        }
                                })}}/>
                                <SettingsMenuNumElemet title='Чувствительность' value={settings.sensitivity as number} changeEvent={(event)=>{setSettings((prev)=>{
                                        if(prev){
                                            prev.sensitivity=Number(event.target.value)
                                            return {...prev}
                                        }
                                        else{
                                            return null
                                        }
                                })}}/>
                                <SettingsMenuNumElemet title='Частота отправки данных' value={settings.dataSendingSpan as number} changeEvent={(event)=>{
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
                                <button onClick={saveAdminSettings}>Сохранить</button>
                                <button onClick={()=>setSensorActive(false, imei)}>ДЕАКТИВИРОВАТЬ</button>
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
                                <button onClick={saveSettings}>Сохранить</button>
                            </>
                        )
                    }
                    </>
                ) : (<p>Loading</p>)
            }
        </div>
    )
}