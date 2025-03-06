using FarmProject.db.models;
using FarmProject.db.services;
using FarmProject.db.services.providers;
using FarmProject.dto.pressure_sensor.services;
using FarmProject.hubs.services;

namespace FarmProject.alarm.services
{
    public class AlarmPressureSensorService(PressureSensorProvider _sensors, PressureAlarmDtoConvertService _alarmConverter,
        MeasurementsHubService _measurementsHubService, AlarmMeasurementsConverter _converter)
    {
        public async Task<AlarmedPressureMeasurements?> AddAlarmMeasurementAsync(PressureMeasurements measurements)
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

        public async Task SendAlarmNotifyAsync(PressureMeasurements measurements)
        {
            await _measurementsHubService.SendAlarmNotifyAsync(_alarmConverter.ConvertToHubAlarmToClientDto(measurements),
                                        measurements.IMEI);
        }

        public async Task SendAlarmNotifyAsync(AlarmedPressureMeasurements measurements)
        {
            await _measurementsHubService.SendAlarmNotifyAsync(_alarmConverter.ConvertToHubAlarmToClientDto(measurements),
                                        measurements.Imei);
        }
    }
}
