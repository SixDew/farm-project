namespace FarmProject.dto
{
    public class AddSensorFromClientDto
    {
        public required string GPS { get; set; }
        public required string IMEI { get; set; }
        public required double RDEV { get; set; }
    }
}
