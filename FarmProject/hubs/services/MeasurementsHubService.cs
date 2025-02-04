using Microsoft.AspNetCore.SignalR;
using System.Text.Json;

namespace FarmProject.hubs.services;

public class MeasurementsHubService(IHubContext<MeasurementsHub> hubContext)
{
    private readonly IHubContext<MeasurementsHub> _hubContext = hubContext;

    public async Task SendMeasurementsToAllSync(HubMeasurementsData data)
    {
        await _hubContext.Clients.All.SendAsync("ReciveMeasurements", JsonSerializer.Serialize(data));
    }
}
