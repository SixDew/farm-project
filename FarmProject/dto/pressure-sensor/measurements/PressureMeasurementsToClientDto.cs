namespace FarmProject.dto
{
    public class PressureMeasurementsToClientDto
    {
        public required double Measurment1 { get; init; }
        public required double Measurment2 { get; init; }
        public required DateTime MeasurmentsTime { get; init; }
    }
}
