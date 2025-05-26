using FarmProject.dto.pressure_sensor.notifications;

namespace FarmProject.db.models
{
    public class WarningMeasurementsNotification : Notification
    {
        public required WarningMeasurementsNotificationData Data { get; set; }
    }
}
