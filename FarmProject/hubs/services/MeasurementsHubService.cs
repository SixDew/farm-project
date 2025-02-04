using Microsoft.AspNetCore.SignalR;

namespace FarmProject.hubs.services;

public class MeasurementsHubService(IHubContext<MeasurementsHub> hubContext)
{
    private readonly IHubContext<MeasurementsHub> _hubContext = hubContext;

    public async Task SendMeasurementsAsync(HubMeasurementsData data, string imei)
    {
        await _hubContext.Clients.Group(GroupNameComposer.GetPressureGroup(imei)).SendAsync("ReciveMeasurements", data);
    }
}
