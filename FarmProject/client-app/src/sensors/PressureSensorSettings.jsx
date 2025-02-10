import { useEffect, useState } from 'react'
import './PressureSensorSettings.css'
import { getPressureSettings, updatePressureSettings } from './api/sensors-api'
import SettingsMenuNumElemet from './SettingsMenuNumElement'
import SettingsMenuBoolElemet from './SettingsMenuBoolElemet'
 
export default function PressureSensorSettings({imei}){
    const [settings, setSettings] = useState(null)
    const [showSaveOkMessage, setShowSaveOkMessage] = useState(false)
    const [showSaveErrorMessage, setShowSaveErrorMessage] = useState(false)

    async function saveSettings(){
        const response = await updatePressureSettings(imei, settings)
        .catch((err)=>{
            console.error('Update setting error', err)
            setShowSaveErrorMessage(true)
        })
        if(response.ok){
            setShowSaveOkMessage(true)
        }
        else{
            setShowSaveErrorMessage(false)
        }
    }

    useEffect(()=>{
        async function getSettings(){
            if(!settings){
                const settingsData = await getPressureSettings(imei)
                setSettings(settingsData)
            }
        }

        getSettings()
    },[])

    useEffect(()=>{
        setShowSaveOkMessage(false)
        setShowSaveErrorMessage(false)
    }, [settings])

    return(
        <div id='main-container'>
            {settings? (
                <div id='internal-settings-container'>
                    <SettingsMenuNumElemet title='Отклонение' value={settings.deviationSpan} changeEvent={(event)=>{setSettings((prev)=>{
                        prev.deviationSpan=event.target.value
                        return {...prev}
                    })}}/>
                    <SettingsMenuNumElemet title='Чувствительность' value={settings.sensitivity} changeEvent={(event)=>{setSettings((prev)=>{
                        prev.sensitivity=event.target.value
                        return {...prev}
                    })}}/>
                    <SettingsMenuNumElemet title='Частота отправки данных' value={settings.dataSendingSpan} changeEvent={(event)=>{
                        setSettings((prev)=>{
                            prev.dataSendingSpan=event.target.value
                            return {...prev}
                        })}}/>
                    <SettingsMenuBoolElemet title='Отправка предупреждений' value={settings.alarmActivated} changeEvent={(event)=>{
                        setSettings((prev)=>{
                            prev.alarmActivated = event.target.checked
                            return {...prev}
                        })
                    }}/>
                    <SettingsMenuBoolElemet title='Первый сенсор' value={settings.firstSensorIsActive} changeEvent={(event)=>{
                        setSettings((prev)=>{
                            prev.firstSensorIsActive = event.target.checked
                            return {...prev}
                        })
                    }}/>
                    <SettingsMenuBoolElemet title='Второй сенсор' value={settings.secondSensorIsActive} changeEvent={(event)=>{
                        setSettings((prev)=>{
                            prev.secondSensorIsActive = event.target.checked
                            return {...prev}
                        })
                    }}/>

                    {showSaveOkMessage && <p className='ok-message'>Настройки успешно сохранены</p>}
                    {showSaveErrorMessage && <p className='error-message'>Ошибка сохранения настроек</p>}

                    <button onClick={saveSettings}>Сохранить</button>
                </div>
            ) : (<p>Loading</p>)}
        </div>
    )
}