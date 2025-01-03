using FarmProject.db.services.providers;

namespace FarmProject.validation.services
{
    public class PressureValidationService(PressureSensorProvider sensorProvider)
    {
        public async Task<bool> IsValidated(string imei)
        {
            var sensor = await sensorProvider.GetByImeiAsync(imei);
            return sensor is not null;
        }
    }
}
