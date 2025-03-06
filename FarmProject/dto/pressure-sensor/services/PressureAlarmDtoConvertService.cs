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
                MeasurementsTime = measurements.MeasurementsTime,
                Imei = measurements.IMEI
            };
        }

        public HubPressureAlarmToClientDto ConvertToHubAlarmToClientDto(AlarmedPressureMeasurements measurements)
        {
            return new()
            {
                Imei = measurements.Imei,
                Measurement1 = measurements.Measurements.PRR1,
                Measurement2 = measurements.Measurements.PRR2,
                MeasurementsTime = measurements.Measurements.MeasurementsTime
            };
        }
    }
}
