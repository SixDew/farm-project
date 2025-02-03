export async function getAllPressureSensors(){
    const response = await fetch('https://localhost:7061/sensors/pressure')
    if(response.ok){
        return await response.json()
    }
}