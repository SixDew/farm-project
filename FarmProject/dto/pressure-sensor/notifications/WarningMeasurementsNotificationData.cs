using Microsoft.EntityFrameworkCore;

namespace FarmProject.dto.pressure_sensor.notifications
{
    [Owned]
    public class WarningMeasurementsNotificationData
    {
        public required string Imei { get; set; }
        public required TimeSpan WarningInterval { get; set; }
        public required int MeasurementId { get; set; }
    }
}
