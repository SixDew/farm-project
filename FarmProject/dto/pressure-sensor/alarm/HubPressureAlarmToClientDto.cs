namespace FarmProject.dto.pressure_sensor.alarm
{
    public class HubPressureAlarmToClientDto
    {
        public double Measurement1 { get; init; }
        public double Measurement2 { get; init; }
        public DateTime MeasurementsTime { get; init; }
    }
}
