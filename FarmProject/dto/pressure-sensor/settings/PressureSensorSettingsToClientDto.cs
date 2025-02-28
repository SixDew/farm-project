namespace FarmProject.dto
{
    public class PressureSensorSettingsToClientDto
    {
        public required bool AlarmActivated { get; set; }
        public required string IMEI { get; set; }
    }
}
