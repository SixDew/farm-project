using FarmProject.dto.pressure_sensor.alarm;
using FarmProject.dto.pressure_sensor.measurements;
using FarmProject.dto.pressure_sensor.notifications;
using FarmProject.dto.users;
using Microsoft.AspNetCore.SignalR;

namespace FarmProject.hubs.services;

public class MeasurementsHubService(IHubContext<MeasurementsHub> hubContext)
{
    private readonly IHubContext<MeasurementsHub> _hubContext = hubContext;

    public async Task SendMeasurementsAsync(HubPressureMeasurementsToClientDto data, string imei)
    {
        await _hubContext.Clients.Group(GroupNameComposer.GetPressureGroup(imei)).SendAsync("ReciveMeasurements", data);
    }

    public async Task SendAlarmNotifyAsync(AlarmMeasurementsNotificationData data, NotificationToClientDto notificationData, int userId)
    {
        await _hubContext.Clients.User(userId.ToString()).SendAsync("ReciveAlarmNotify", new { measurementData = data, notificationData });
    }

    public async Task SendAddSensorNotifyAsync(AddSensorNotificationData data, NotificationToClientDto notificationData, int userId)
    {
        await _hubContext.Clients.User(userId.ToString()).SendAsync("ReciveAddSensorNotify", new { sensorData = data, notificationData });
    }

    public async Task SendForecastWarningNotifyAsync(WarningMeasurementsNotificationData data, NotificationToClientDto notificationData, int userId)
    {
        await _hubContext.Clients.User(userId.ToString()).SendAsync("ReciveForecastWarningNotify", new { measurementData = data, notificationData });
    }
}
