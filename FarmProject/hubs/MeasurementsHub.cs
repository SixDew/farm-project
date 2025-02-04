using Microsoft.AspNetCore.SignalR;
using System.Text.Json;

namespace FarmProject.hubs;

public class MeasurementsHub : Hub
{
    public async Task SendPressureMeasurement(HubMeasurementsData data)
    {
        await Clients.All.SendAsync("ReciveMeasurements", JsonSerializer.Serialize(data));
    }

}

public record HubMeasurementsData
{
    public double Measurement1 { get; init; }
    public double Measurement2 { get; init; }
}
