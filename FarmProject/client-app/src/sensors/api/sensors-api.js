import serverUrl from "../../server-url"

export async function getAllPressureSensors(){
    console.log(new Date().toUTCString())
    return await sendRequestWithAuthorize(`${serverUrl}/sensors/pressure`)
}

export async function getPressureMeasurements(imei){
    return await sendRequest(`${serverUrl}/sensors/pressure/measurements/${imei}`)
}

// export async function getPressureSensorData(imei){
//     return await sendRequest(`${serverUrl}/sensors/pressure/${imei}`)
// }

// export async function getPressureSettings(imei){
//     return await sendRequest(`${serverUrl}/sensors/pressure/settings/${imei}`)
// }

// export async function getPressureSettings(imei){
//     const response = await fetch(`${serverUrl}/sensors/pressure/settings/${imei}`, {
//         method: 'GET',
//         headers: {
//             'Authorization':AuthorizathionHeader
//         }
//     })
//     if(response.ok){
//         return await response.json()
//     }
// }

export async function getAlarmedMeasurements(imei) {
    return await sendRequestWithAuthorize(`${serverUrl}/sensors/pressure/measurements/alarms/${imei}`)
}

export async function getPressureSensorData(imei, redirect){
    const response = await sendRequestWithAuthorize(`${serverUrl}/sensors/pressure/${imei}`)
    if(response.status === 401){
        redirect()
    }
    if(response.ok){
        return await response.json()
    }
}

export async function getPressureSettings(imei){
    return await sendRequestWithAuthorize(`${serverUrl}/sensors/pressure/settings/${imei}`)
}

export async function sendAlarmedMeasurementChecked(id, imei) {
    const AuthorizathionHeader = `Bearer ${localStorage.getItem('userKey')}`
    const response = await fetch(`${serverUrl}/sensors/pressure/measurements/alarms/${imei}/check/${id}`, {
        method: 'POST',
        headers: {
            'Authorization':AuthorizathionHeader
        }
    })
    return response
}

export async function getAdminPressureSettings(imei){
    return await sendRequestWithAuthorize(`${serverUrl}/sensors/pressure/admin/settings/${imei}`)
}

export async function updatePressureSettings(imei, settings) {
    const AuthorizathionHeader = `Bearer ${localStorage.getItem('userKey')}`
    const response = await fetch(`${serverUrl}/sensors/pressure/settings/${imei}`,{
        method:'PUT',
        headers:{
            'Content-Type':'application/json',
            'Authorization':AuthorizathionHeader
        },
        body: JSON.stringify(settings)
    })
    return response
}

export async function updateAdminPressureSettings(imei, settings) {
    const AuthorizathionHeader = `Bearer ${localStorage.getItem('userKey')}`
    const response = await fetch(`${serverUrl}/sensors/pressure/admin/settings/${imei}`,{
        method:'PUT',
        headers:{
            'Content-Type':'application/json',
            'Authorization':AuthorizathionHeader
        },
        body: JSON.stringify(settings)
    })
    return response
}

async function sendRequest(url){
    const response = await fetch(url)
    if(response.ok){
        return await response.json()
    }
}

async function sendRequestWithAuthorize(url) {
    const AuthorizathionHeader = `Bearer ${localStorage.getItem('userKey')}`
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization':AuthorizathionHeader
        }
    })
    return response
}