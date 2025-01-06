using FarmProject.db.models;

namespace FarmProject.dto.servisces
{
    public class PressureSensorDtoConvertService(PressureMeasurmentsDtoConvertService measurementsConverter,
            PressureSettingsDtoConvertService settingsConverter)
    {
        public PressureSensor ConvertToMoodel(PressureSensorFromClientDto sensor)
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
                Settings = settingsConverter.ConvertToClient(sensor.Settings),
                Measurements = sensor.Measurements.Select(m => measurementsConverter.ConvertToClientDto(m)).ToList()
            };
        }
    }
}
