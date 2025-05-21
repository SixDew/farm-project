namespace FarmProject.dto
{
    public class PressureMeasurementsFromSensorDto
    {
        public required string IMEI { get; set; }
        public required float PRR1 { get; set; }
        public required float PRR2 { get; set; }
    }
}
