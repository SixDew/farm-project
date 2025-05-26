import * as signalR from '@microsoft/signalr';

const connection = new signalR.HubConnectionBuilder()
.withUrl("https://localhost:7061/sensors/measurements/hub",{
    accessTokenFactory: () => localStorage.getItem("userKey") ?? "",
    transport: signalR.HttpTransportType.WebSockets,
})
.withAutomaticReconnect()
.build()

export default connection
