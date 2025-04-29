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

export async function getUncheckedAlarmedMeasurements(imei:string) {
    return await sendRequestWithAuthorize(`${serverUrl}/sensors/pressure/measurements/alarms/unchecked/${imei}`)
}

export async function getCheckedAlarmedMeasurements(imei:string) {
    return await sendRequestWithAuthorize(`${serverUrl}/sensors/pressure/measurements/alarms/checked/${imei}`)
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

export async function getGroups() {
    return await sendRequestWithAuthorize(`${serverUrl}/groups`)
}

export async function addGroup(facilityId:number, groupName:string) {
    const name = groupName
    const AuthorizathionHeader = `Bearer ${localStorage.getItem('userKey')}`
    const response = await fetch(`${serverUrl}/groups/${facilityId}`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization':AuthorizathionHeader
        },
        body: JSON.stringify(
            name
        )
    })
    return response
}

export async function getSections() {
    return await sendRequestWithAuthorize(`${serverUrl}/sections`)
}

export async function sendGroupChangeList(id:number, sensorsImei:string[]){
    const AuthorizathionHeader = `Bearer ${localStorage.getItem('userKey')}`
    const response = await fetch(`${serverUrl}/groups/change/${id}`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization':AuthorizathionHeader
        },
        body: JSON.stringify(
            sensorsImei
        )
    })
    return response
}

export async function getFacility(id:number) {
    return await sendRequestWithAuthorize(`${serverUrl}/facilities/${id}`)   
}

export async function getFacilities(){
    return await sendRequestWithAuthorize(`${serverUrl}/facilities`)
}

export async function addSection(name:string, facilityId:number) {
    const AuthorizathionHeader = `Bearer ${localStorage.getItem('userKey')}`
    const response = await fetch(`${serverUrl}/sections/add/${facilityId}`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization':AuthorizathionHeader
        },
        body: JSON.stringify(name)
    })
    return response
}

export async function addToGroup(groupId, sensorImei) {
    const AuthorizathionHeader = `Bearer ${localStorage.getItem('userKey')}`
    const response = await fetch(`${serverUrl}/groups/add/${groupId}`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization':AuthorizathionHeader
        },
        body: JSON.stringify(
            sensorImei
        )
    })
    return response
}

export async function deleteGroup(groupId:number) {
    const AuthorizathionHeader = `Bearer ${localStorage.getItem('userKey')}`
    const response = await fetch(`${serverUrl}/groups/delete/${groupId}`,{
        method:'DELETE',
        headers:{
            'Content-Type':'application/json',
            'Authorization':AuthorizathionHeader
        },
    })
    return response
}

export async function deleteSection(sectionId:number) {
    const AuthorizathionHeader = `Bearer ${localStorage.getItem('userKey')}`
    const response = await fetch(`${serverUrl}/sections/${sectionId}`,{
        method:'DELETE',
        headers:{
            'Content-Type':'application/json',
            'Authorization':AuthorizathionHeader
        },
    })
    return response
}

export async function changeSectionMetadata(sectionId:number, sectionName:string) {
    const AuthorizathionHeader = `Bearer ${localStorage.getItem('userKey')}`
    const response = await fetch(`${serverUrl}/sections/change-meta`,{
        method:'PUT',
        headers:{
            'Content-Type':'application/json',
            'Authorization':AuthorizathionHeader
        },
        body:JSON.stringify({
            name:sectionName,
            id:sectionId
        })
    })
    return response
}

export async function changeGroupMetadata(groupId:number, groupName:string) {
    const AuthorizathionHeader = `Bearer ${localStorage.getItem('userKey')}`
    const response = await fetch(`${serverUrl}/groups/change-meta`,{
        method:'PUT',
        headers:{
            'Content-Type':'application/json',
            'Authorization':AuthorizathionHeader
        },
        body:JSON.stringify({
            name:groupName,
            id:groupId
        })
    })
    return response
}

export async function getDisabledSensors() {
    return await sendRequestWithAuthorize(`${serverUrl}/sensors/pressure/disabled`)
}

export async function setSensorActive(isActive:boolean, imei:string, sectionId?:number) {
    const AuthorizathionHeader = `Bearer ${localStorage.getItem('userKey')}`
    var url:string = ''
    sectionId ? url = `${serverUrl}/sensors/pressure/${imei}/set-active?isActive=${isActive}&sectionId=${sectionId}` : 
        url = `${serverUrl}/sensors/pressure/${imei}/set-active?isActive=${isActive}`
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization':AuthorizathionHeader
        }
    })
    return response
}

export async function getFacilitiesDeppMeta() {
    return await sendRequestWithAuthorize(`${serverUrl}/facilities/metadata`)
}

export async function getGroupsMetadata(imei) {
    return await sendRequestWithAuthorize(`${serverUrl}/groups/sensor/${imei}`)
}

export async function removeFromGroup(groupId, sensorImei) {
    const AuthorizathionHeader = `Bearer ${localStorage.getItem('userKey')}`
    const response = await fetch(`${serverUrl}/groups/remove/${groupId}`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization':AuthorizathionHeader
        },
        body: JSON.stringify(
            sensorImei
        )
    })
    return response
}

export async function getZones() {
    return await sendRequestWithAuthorize(`${serverUrl}/map/zones`)
}

export async function sendZone(zone, sectionId:number) {
    const AuthorizathionHeader = `Bearer ${localStorage.getItem('userKey')}`
    const response = await fetch(`${serverUrl}/map/zones`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization':AuthorizathionHeader
        },
        body: JSON.stringify({
            ...zone, SectionId:sectionId
        })
    })
    return response
}

export async function deleteZone(id) {
    const AuthorizathionHeader = `Bearer ${localStorage.getItem('userKey')}`
    const response = await fetch(`${serverUrl}/map/zones/${id}`,{
        method:'Delete',
        headers:{
            'Content-Type':'application/json',
            'Authorization':AuthorizathionHeader
        },
    })
    return response
}

export async function editZone(zone, sectionId:number, zoneId:number) {
    const AuthorizathionHeader = `Bearer ${localStorage.getItem('userKey')}`
    const response = await fetch(`${serverUrl}/map/zones/${zoneId}`,{
        method:'PUT',
        headers:{
            'Content-Type':'application/json',
            'Authorization':AuthorizathionHeader
        },
        body:JSON.stringify({...zone, SectionId:sectionId})
    })
    return response
}

export async function deleteSensor(imei:string) {
    const AuthorizathionHeader = `Bearer ${localStorage.getItem('userKey')}`
    const response = await fetch(`${serverUrl}/sensors/pressure/${imei}`,{
        method:'Delete',
        headers:{
            'Content-Type':'application/json',
            'Authorization':AuthorizathionHeader
        },
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
