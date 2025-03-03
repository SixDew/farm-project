using FarmProject.db.models;
using FarmProject.dto.pressure_sensor.alarm;

namespace FarmProject.dto.pressure_sensor.services
{
    public class PressureAlarmDtoConvertService
    {
        public HubPressureAlarmToClientDto ConvertToHubAlarmToClientDto(PressureMeasurements measurements)
        {
            return new()
            {
                Measurement1 = measurements.PRR1,
                Measurement2 = measurements.PRR2,
                MeasurementsTime = measurements.MeasurementsTime
            };
        }
    }
}
