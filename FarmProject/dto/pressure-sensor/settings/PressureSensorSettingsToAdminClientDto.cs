namespace FarmProject.dto.pressure_sensor.settings
{
    public class PressureSensorSettingsToAdminClientDto
    {
        public required double DeviationSpanPositive { get; set; }
        public required double DeviationSpanNegative { get; set; }
        public required double Sensitivity { get; set; }
        public required bool AlarmActivated { get; set; }
        public required bool FirstSensorIsActive { get; set; }
        public required bool SecondSensorIsActive { get; set; }
        public required double DataSendingSpan { get; set; }

        public required string IMEI { get; set; }
    }
}
