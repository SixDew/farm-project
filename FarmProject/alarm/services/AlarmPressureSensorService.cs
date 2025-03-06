using FarmProject.db.models;
using FarmProject.db.services.providers;
using FarmProject.dto.pressure_sensor.services;
using FarmProject.hubs.services;

namespace FarmProject.alarm.services
{
    public class AlarmPressureSensorService(PressureSensorProvider _sensors, PressureAlarmDtoConvertService _alarmConverter,
        MeasurementsHubService _measurementsHubService)
    {
        public async Task AddAlarmMeasurementAsync(PressureMeasurements measurements)
        {

        }

        public async Task SendAlarmNotifyAsync(PressureMeasurements measurements)
        {
            await _measurementsHubService.SendAlarmNotifyAsync(_alarmConverter.ConvertToHubAlarmToClientDto(measurements),
                                        measurements.IMEI);
        }
    }
}
