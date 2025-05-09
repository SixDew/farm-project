using FarmProject.db.models;

namespace FarmProject.db.services;

public class AlarmMeasurementsConverter
{
    public AlarmedMeasurements ConvertToAlarmMeasurements(Measurements measurements)
    {
        return new()
        {
            Imei = measurements.IMEI,
            isChecked = false,
            Measurements = measurements,
        };
    }
}
