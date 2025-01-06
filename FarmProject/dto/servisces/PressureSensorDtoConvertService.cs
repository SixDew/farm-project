using FarmProject.db.models;

namespace FarmProject.dto.servisces
{
    public class PressureSensorDtoConvertService
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
    }
}
