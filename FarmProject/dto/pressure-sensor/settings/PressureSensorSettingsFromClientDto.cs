namespace FarmProject.dto
{
    public class PressureSensorSettingsFromClientDto
    {
        public required double DeviationSpan { get; set; }
        public required double Sensitivity { get; set; }
        public required bool AlarmActivated { get; set; }
        public required bool FirstSensorIsActive { get; set; }
        public required bool SecondSensorIsActive { get; set; }
        public required double DataSendingSpan { get; set; }
    }
}
