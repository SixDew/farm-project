export async function getAllPressureSensors(){
    return await getRequest(`${serverUrl}/sensors/pressure`)
}

export async function getPressureMeasurements(imei){
    return await getRequest(`${serverUrl}/sensors/pressure/measurements/${imei}`)
}

export async function getPressureSensorData(imei){
    return await getRequest(`${serverUrl}/sensors/pressure/${imei}`)
}

async function getRequest(url){
    const response = await fetch(url)
    if(response.ok){
        return await response.json()
    }
}

const serverUrl = 'https://localhost:7061'