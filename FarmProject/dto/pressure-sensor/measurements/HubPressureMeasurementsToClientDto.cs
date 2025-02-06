namespace FarmProject.dto.pressure_sensor.measurements;

public record HubPressureMeasurementsToClientDto
{
    public double Measurement1 { get; init; }
    public double Measurement2 { get; init; }
    public DateTime MeasurementsTime { get; init; }
}
