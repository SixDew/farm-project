namespace FarmProject.dto
{
    public class PressureMeasurementsToClientDto
    {
        public required double Measurement1 { get; init; }
        public required double Measurement2 { get; init; }
        public required DateTime MeasurementsTime { get; init; }
    }
}
