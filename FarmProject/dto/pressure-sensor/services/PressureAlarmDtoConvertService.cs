using FarmProject.db.models;
using FarmProject.dto.pressure_sensor.alarm;

namespace FarmProject.dto.pressure_sensor.services
{
    public class PressureAlarmDtoConvertService
    {
        public PressureAlarmToClientDto ConvertToHubAlarmToClientDto(PressureMeasurements measurements)
        {
            return new()
            {
                Measurement1 = measurements.PRR1,
                Measurement2 = measurements.PRR2,
                MeasurementsTime = measurements.MeasurementsTime,
                Imei = measurements.IMEI,
                Id = measurements.Id
            };
        }

        public PressureAlarmToClientDto ConvertToHubAlarmToClientDto(AlarmedPressureMeasurements measurements)
        {
            return new()
            {
                Imei = measurements.Imei,
                Measurement1 = measurements.Measurements.PRR1,
                Measurement2 = measurements.Measurements.PRR2,
                MeasurementsTime = measurements.Measurements.MeasurementsTime,
                Id = measurements.Id
            };
        }
    }
}
