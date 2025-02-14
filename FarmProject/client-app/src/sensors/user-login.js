import serverUrl from "../server-url";

export async function login(key){
    const response = await fetch(`${serverUrl}/login`, {
        method: 'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(key)
    })
    return response
}