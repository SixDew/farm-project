import serverUrl from "../server-url";

export async function login(key){
    const response = await fetch(`${serverUrl}/login`, {
        method: 'POST',
        credentials: 'include',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(key)
    })
    return response
}

export async function adminLogin(key) {
    const response = await fetch(`${serverUrl}/login/admin`, {
        method: 'POST',
        credentials: 'include',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(key)
    })
    return response
}

export async function getUsers() {
    const AuthorizathionHeader = getAuthHeader()
    const response = await fetch(`${serverUrl}/admin/users`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Authorization':AuthorizathionHeader
        }
    })
    return response
}

export async function updateUserData(userData) {
    const AuthorizathionHeader = getAuthHeader()
    const response = await fetch(`${serverUrl}/users`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type':'application/json',
            'Authorization':AuthorizathionHeader
        },
        body:JSON.stringify(userData)
    })
    return response
}

export async function createUser(userData) {
    const AuthorizathionHeader = getAuthHeader()
    const response = await fetch(`${serverUrl}/users`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type':'application/json',
            'Authorization':AuthorizathionHeader
        },
        body:JSON.stringify(userData)
    })
    return response
}

export async function removeUser(id) {
    const AuthorizathionHeader = getAuthHeader()
    const response = await fetch(`${serverUrl}/users`, {
        method: 'DELETE',
        credentials: 'include',
        headers:{
            Authorization: AuthorizathionHeader,
            'Content-Type':'application/json'
        },
        body: JSON.stringify(id)
    })
    return response
}

function getAuthHeader(){
    return `Bearer ${localStorage.getItem('userKey')}`
}