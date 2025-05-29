using FarmProject.db.models;
using FarmProject.dto.pressure_sensor.notifications;

namespace FarmProject.dto.servisces
{
    public class PressureSensorDtoConvertService(PressureMeasurmentsDtoConvertService measurementsConverter,
            PressureSettingsDtoConvertService settingsConverter)
    {
        public Sensor ConvertToModel(AddSensorFromClientDto sensor)
        {
            return new Sensor()
            {
                GPS = sensor.GPS,
                IMEI = sensor.IMEI,
                Settings = new() { IMEI = sensor.IMEI },
                SectionId = null
            };
        }

        public PressureSensorToClientDto ConvertToClient(Sensor sensor)
        {
            return new PressureSensorToClientDto()
            {
                Gps = sensor.GPS,
                Imei = sensor.IMEI,
                Settings = sensor.Settings is not null ? settingsConverter.ConvertToClient(sensor.Settings) : null,
                Measurements = sensor.Measurements is not null ? sensor.Measurements.Select(measurementsConverter.ConvertToClientDto).ToList() : null,
                SectionId = sensor.SectionId
            };
        }

        public AddSensorNotificationData ConvertToNotificationData(Sensor sensor)
        {
            return new AddSensorNotificationData()
            {
                Gps = sensor.GPS,
                Imei = sensor.IMEI,
                Settings = sensor.Settings is not null ? settingsConverter.ConvertToClient(sensor.Settings) : null,
                Measurements = sensor.Measurements is not null ? sensor.Measurements.Select(measurementsConverter.ConvertToClientDto).ToList() : null,
                SectionId = sensor.SectionId
            };
        }
    }
}
