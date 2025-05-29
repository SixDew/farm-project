using Microsoft.EntityFrameworkCore;

namespace FarmProject.dto.pressure_sensor.notifications
{
    [Owned]
    public class AddSensorNotificationData
    {
        public required string Imei { get; set; }
        public required string Gps { get; set; }
        public required List<PressureMeasurementsToClientDto> Measurements { get; set; }
        public required PressureSensorSettingsToClientDto Settings { get; set; }
        public int? SectionId { get; set; }
    }
}
