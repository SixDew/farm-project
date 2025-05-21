namespace FarmProject.dto.pressure_sensor.settings
{
    public class PressureSettingsToSensorDto
    {
        public required float DeviationSpanPositive { get; set; }
        public required float DeviationSpanNegative { get; set; }
        public required float Sensitivity { get; set; }
        public required bool AlarmActivated { get; set; }
        public required bool FirstSensorIsActive { get; set; }
        public required bool SecondSensorIsActive { get; set; }
        public required float DataSendingSpan { get; set; }
    }
}
