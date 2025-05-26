using FarmProject.db.models;
using FarmProject.db.services.providers;
using FarmProject.dto.pressure_sensor.alarm;
using FarmProject.dto.pressure_sensor.notifications;
using FarmProject.dto.users.services;
using FarmProject.hubs.services;

namespace FarmProject.notifications;

public class NotificationService(IServiceProvider _services, MeasurementsHubService _notifySender, UserDtoConverter _converter)
{
    public async Task SendWarningForecastedMeasurementsNotificationAsync(WarningMeasurementsNotificationData notificationData, int userId)
    {
        using (var scope = _services.CreateScope())
        {
            var users = scope.ServiceProvider.GetRequiredService<UserProvider>();
            var notifications = await users.GetNotificationsAsync(userId);

            var notification = new WarningMeasurementsNotification()
            {
                Data = notificationData,
                Text = $"Обнаружено постепенное изменение измерений. При сохранении тенденции они достигнут порога через {notificationData.WarningInterval}"
            };

            notifications.Add(notification);
            await users.SaveChangesAsync();

            await _notifySender.SendForecastWarningNotifyAsync(
                notification.Data,
                _converter.ConvertNotification(notification),
                userId);
        }
    }

    public async Task SendWarningForecastedMeasurementsNotificationToAllAsync(WarningMeasurementsNotificationData notificationData, int facilityId)
    {
        using (var scope = _services.CreateScope())
        {
            var users = scope.ServiceProvider.GetRequiredService<UserProvider>();

            var usersWithNotifications = await users.GetAllFacilityUsersWithNotificationsAsync(facilityId);

            var notification = new WarningMeasurementsNotification()
            {
                Data = notificationData,
                Text = $"Обнаружено постепенное изменение измерений. При сохранении тенденции они достигнут порога через {notificationData.WarningInterval}"
            };

            usersWithNotifications.ForEach(u => u.Notifications.Add(notification));
            await users.SaveChangesAsync();
            usersWithNotifications.ForEach(async u => await _notifySender.SendForecastWarningNotifyAsync(
                notification.Data,
                _converter.ConvertNotification(notification),
                u.Id));
        }
    }

    public async Task SendAlarmMeasurementsNotificationAsync(AlarmMeasurementsNotificationToClientDto data, int userId)
    {
        using (var scope = _services.CreateScope())
        {
            var users = scope.ServiceProvider.GetRequiredService<UserProvider>();
            var notifications = await users.GetNotificationsAsync(userId);

            var notification = new AlarmMesurementsNotification()
            {
                Data = data,
                Text = $"Пересечен порог измерений на датчике {data.Imei} !"
            };

            notifications.Add(notification);
            await users.SaveChangesAsync();

            await _notifySender.SendAlarmNotifyAsync(
                notification.Data,
                _converter.ConvertNotification(notification),
                userId);
        }
    }

    public async Task SendAlarmMeasurementsNotificationToAllAsync(AlarmMeasurementsNotificationToClientDto data, int facilityId)
    {
        using (var scope = _services.CreateScope())
        {
            var users = scope.ServiceProvider.GetRequiredService<UserProvider>();
            var usersWithNotifications = await users.GetAllFacilityUsersWithNotificationsAsync(facilityId);

            var notification = new AlarmMesurementsNotification()
            {
                Data = data,
                Text = $"Пересечен порог измерений на датчике {data.Imei} !"
            };

            usersWithNotifications.ForEach(u => u.Notifications.Add(notification));
            await users.SaveChangesAsync();
            usersWithNotifications.ForEach(async u => await _notifySender.SendAlarmNotifyAsync(
                notification.Data,
                _converter.ConvertNotification(notification),
                u.Id));
        }
    }
}
