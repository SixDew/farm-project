using FarmProject.dto;
using FarmProject.dto.pressure_sensor.alarm;
using FarmProject.dto.pressure_sensor.measurements;
using FarmProject.dto.pressure_sensor.notifications;
using Microsoft.AspNetCore.SignalR;

namespace FarmProject.hubs.services;

public class MeasurementsHubService(IHubContext<MeasurementsHub> hubContext)
{
    private readonly IHubContext<MeasurementsHub> _hubContext = hubContext;

    public async Task SendMeasurementsAsync(HubPressureMeasurementsToClientDto data, string imei)
    {
        await _hubContext.Clients.Group(GroupNameComposer.GetPressureGroup(imei)).SendAsync("ReciveMeasurements", data);
    }

    public async Task SendAlarmNotifyAsync(AlarmMeasurementsNotificationToClientDto data, int userId)
    {
        await _hubContext.Clients.User(userId.ToString()).SendAsync("ReciveAlarmNotify", data);
    }

    public async Task SendAddSensorNotifyAsync(PressureSensorToClientDto sensor)
    {
        await _hubContext.Clients.Group(GroupNameComposer.GetUsersGroup()).SendAsync("ReciveAddSensorNotify", sensor);
    }

    public async Task SendForecastWarningNotifyAsync(WarningMeasurementsNotificationData data, int userId)
    {
        await _hubContext.Clients.User(userId.ToString()).SendAsync("ReciveForecastWarningNotify", data);
    }
}
