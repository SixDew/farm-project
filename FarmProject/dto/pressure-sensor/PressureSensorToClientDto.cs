namespace FarmProject.dto
{
    public class PressureSensorToClientDto
    {
        public required string Imei { get; set; }
        public required string Gps { get; set; }
        public required List<PressureMeasurementsToClientDto> Measurements { get; set; }
        public required PressureSensorSettingsToClientDto Settings { get; set; }
        public int SectionId { get; set; }
    }
}
