using FarmProject.dto.pressure_sensor.alarm;
using FarmProject.dto.pressure_sensor.measurements;
using Microsoft.AspNetCore.SignalR;

namespace FarmProject.hubs.services;

public class MeasurementsHubService(IHubContext<MeasurementsHub> hubContext)
{
    private readonly IHubContext<MeasurementsHub> _hubContext = hubContext;

    public async Task SendMeasurementsAsync(HubPressureMeasurementsToClientDto data, string imei)
    {
        await _hubContext.Clients.Group(GroupNameComposer.GetPressureGroup(imei)).SendAsync("ReciveMeasurements", data);
    }

    public async Task SendAlarmNotifyAsync(PressureAlarmToClientDto data, string imei)
    {
        await _hubContext.Clients.Group(GroupNameComposer.GetPressureGroup(imei)).SendAsync("ReciveAlarmNotify", data);
    }
}
