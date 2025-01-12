using FarmProject.db.models;

namespace FarmProject.dto.servisces
{
    public class PressureSensorDtoConvertService(PressureMeasurmentsDtoConvertService measurementsConverter,
            PressureSettingsDtoConvertService settingsConverter)
    {
        public PressureSensor ConvertToModel(AddSensorFromClientDto sensor)
        {
            return new PressureSensor()
            {
                GPS = sensor.Gps,
                IMEI = sensor.Imei,
                Settings = new() { IMEI = sensor.Imei }
            };
        }

        public PressureSensorToClientDto ConvertToClient(PressureSensor sensor)
        {
            return new PressureSensorToClientDto()
            {
                Gps = sensor.GPS,
                Imei = sensor.IMEI,
                Settings = sensor.Settings is not null ? settingsConverter.ConvertToClient(sensor.Settings) : null,
                Measurements = sensor.Measurements is not null ? sensor.Measurements.Select(measurementsConverter.ConvertToClientDto).ToList() : null
            };
        }
    }
}
