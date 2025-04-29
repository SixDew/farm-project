using FarmProject.db.models;

namespace FarmProject.db.services;

public class AlarmMeasurementsConverter
{
    public AlarmedPressureMeasurements ConvertToAlarmMeasurements(PressureMeasurements measurements)
    {
        return new()
        {
            Imei = measurements.IMEI,
            isChecked = false,
            Measurements = measurements,
        };
    }
}
