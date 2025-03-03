using FarmProject.db.models;
using FarmProject.db.services.providers;

namespace FarmProject.alarm.services
{
    public class AlarmPressureMeasurementsChecker(PressureSensorProvider _sensors)
    {
        public async Task<bool> isAlarmRequredAsync(PressureMeasurements measurements)
        {
            var settings = await _sensors.GetSettingsByImeiAsync(measurements.IMEI);
            if (settings.AlarmActivated)
            {
                if (settings.FirstSensorIsActive &&
                    (measurements.PRR1 > settings.DeviationSpanPositive || measurements.PRR1 < settings.DeviationSpanNegative))
                {
                    return true;
                }
                if (settings.SecondSensorIsActive &&
                    (measurements.PRR2 > settings.DeviationSpanPositive || measurements.PRR2 < settings.DeviationSpanNegative))
                {
                    return true;
                }
            }
            return false;
        }
    }
}
