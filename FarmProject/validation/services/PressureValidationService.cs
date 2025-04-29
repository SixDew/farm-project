using FarmProject.db.services.providers;

namespace FarmProject.validation.services
{
    public class PressureValidationService(PressureSensorProvider sensorProvider)
    {
        public async Task<bool> IsValidatedAsync(string imei)
        {
            var sensor = await sensorProvider.GetByImeiAsync(imei);
            return sensor is not null && sensor.IsActive;
        }
    }
}
