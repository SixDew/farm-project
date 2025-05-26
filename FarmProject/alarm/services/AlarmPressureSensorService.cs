using FarmProject.db.models;
using FarmProject.db.services;
using FarmProject.db.services.providers;
using FarmProject.dto.pressure_sensor.services;

namespace FarmProject.alarm.services
{
    public class AlarmPressureSensorService(SensorsProvider _sensors, PressureAlarmDtoConvertService _alarmConverter, AlarmMeasurementsConverter _converter)
    {
        public async Task<AlarmedMeasurements?> AddAlarmMeasurementAsync(Measurements measurements)
        {
            var alarmedMeasurements = _converter.ConvertToAlarmMeasurements(measurements);
            var alarmedMeasurementsList = await _sensors.GetAlarmedMeasurementsAsync(alarmedMeasurements.Imei);
            if (alarmedMeasurementsList is not null)
            {
                alarmedMeasurementsList.Add(alarmedMeasurements);
                await _sensors.SaveChangesAsync();
                return alarmedMeasurements;
            }
            return null;

        }
    }
}
