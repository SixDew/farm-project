import serverUrl from "../../server-url"

export async function getAllPressureSensors(){
    return await getRequest(`${serverUrl}/sensors/pressure`)
}

export async function getPressureMeasurements(imei){
    return await getRequest(`${serverUrl}/sensors/pressure/measurements/${imei}`)
}

export async function getPressureSensorData(imei){
    return await getRequest(`${serverUrl}/sensors/pressure/${imei}`)
}

export async function getPressureSettings(imei){
    return await getRequest(`${serverUrl}/sensors/pressure/settings/${imei}`)
}

export async function updatePressureSettings(imei, settings) {
    const response = await fetch(`${serverUrl}/sensors/pressure/settings/${imei}`,{
        method:'PUT',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify(settings)
    })
    return response
}

async function getRequest(url){
    const response = await fetch(url)
    if(response.ok){
        return await response.json()
    }
}