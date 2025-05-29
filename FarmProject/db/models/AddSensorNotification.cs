using FarmProject.dto.pressure_sensor.notifications;

namespace FarmProject.db.models
{
    public class AddSensorNotification : Notification
    {
        public required AddSensorNotificationData Data { get; set; }
    }
}
