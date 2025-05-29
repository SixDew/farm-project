using FarmProject.dto.pressure_sensor.alarm;

namespace FarmProject.db.models;

public class AlarmMesurementsNotification : Notification
{
    public required AlarmMeasurementsNotificationData Data { get; set; }
}
