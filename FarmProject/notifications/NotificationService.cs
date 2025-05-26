using FarmProject.db.models;
using FarmProject.db.services.providers;
using FarmProject.dto.pressure_sensor.alarm;
using FarmProject.dto.pressure_sensor.notifications;
using FarmProject.hubs.services;

namespace FarmProject.notifications;

public class NotificationService(IServiceProvider _services, MeasurementsHubService _notifySender)
{
    public async Task SendWarningForecastedMeasurementsNotificationAsync(WarningMeasurementsNotificationData notificationData, int userId)
    {
        using (var scope = _services.CreateScope())
        {
            var users = scope.ServiceProvider.GetRequiredService<UserProvider>();
            var notifications = await users.GetNotificationsAsync(userId);

            var notification = new WarningMeasurementsNotification()
            {
                Data = notificationData
            };

            notifications.Add(notification);
            await users.SaveChangesAsync();

            await _notifySender.SendForecastWarningNotifyAsync(notification.Data, userId);
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
                Data = notificationData
            };

            usersWithNotifications.ForEach(u => u.Notifications.Add(notification));
            await users.SaveChangesAsync();
            usersWithNotifications.ForEach(async u => await _notifySender.SendForecastWarningNotifyAsync(notification.Data, u.Id));
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
                Data = data
            };

            notifications.Add(notification);
            await users.SaveChangesAsync();

            await _notifySender.SendAlarmNotifyAsync(notification.Data, userId);
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
                Data = data
            };

            usersWithNotifications.ForEach(u => u.Notifications.Add(notification));
            await users.SaveChangesAsync();
            usersWithNotifications.ForEach(async u => await _notifySender.SendAlarmNotifyAsync(notification.Data, u.Id));
        }
    }
}
