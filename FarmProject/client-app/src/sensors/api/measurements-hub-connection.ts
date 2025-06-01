import * as signalR from '@microsoft/signalr';

const createConnection = (token:string) => {return new signalR.HubConnectionBuilder()
.withUrl("https://localhost:7061/sensors/measurements/hub",{
    accessTokenFactory: () => token,
    transport: signalR.HttpTransportType.WebSockets,
})
.withAutomaticReconnect()
.build()
}

export default createConnection
