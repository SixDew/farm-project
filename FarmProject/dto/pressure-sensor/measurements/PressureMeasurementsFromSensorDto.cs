namespace FarmProject.dto
{
    public class PressureMeasurementsFromSensorDto
    {
        public required string IMEI { get; set; }
        public required double PRR1 { get; set; }
        public required double PRR2 { get; set; }
    }
}
