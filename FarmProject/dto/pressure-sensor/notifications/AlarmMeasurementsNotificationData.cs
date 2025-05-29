using Microsoft.EntityFrameworkCore;

namespace FarmProject.dto.pressure_sensor.alarm
{
    [Owned]
    public class AlarmMeasurementsNotificationData
    {
        public required int Id { get; set; }
        public double Measurement1 { get; init; }
        public double Measurement2 { get; init; }
        public bool IsChecked { get; set; }
        public DateTime MeasurementsTime { get; init; }
        public required string Imei { get; init; }
    }
}
