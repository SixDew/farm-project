import * as signalR from '@microsoft/signalr';

const connection = new signalR.HubConnectionBuilder()
.withUrl("https://localhost:7061/sensors/measurements/hub",{
    transport: signalR.HttpTransportType.WebSockets,
})
.withAutomaticReconnect()
.build()

connection.start()
.then(()=>{console.log("StartConnection")})
.catch((err)=>{console.error("Connection Error", err)})

export default connection
