using FarmProject.db.models;

namespace FarmProject.dto.servisces
{
    public class PressureSettingsDtoConvertService
    {
        public PressureSensorSettingsToClientDto ConvertToClient(PressureSensorSettings settings)
        {
            return new PressureSensorSettingsToClientDto()
            {
                AlarmActivated = settings.AlarmActivated,
                DataSendingSpan = settings.DataSendingSpan,
                DeviationSpan = settings.DeviationSpan,
                FirstSensorIsActive = settings.FirstSensorIsActive,
                IMEI = settings.IMEI,
                SecondSensorIsActive = settings.SecondSensorIsActive,
                Sensitivity = settings.Sensitivity
            };
        }

        public PressureSensorSettings ConvertFromClient(PressureSensorSettingsFromClientDto settings)
        {
            return new PressureSensorSettings
            {
                Sensitivity = settings.Sensitivity,
                SecondSensorIsActive = settings.SecondSensorIsActive,
                IMEI = settings.IMEI,
                FirstSensorIsActive = settings.FirstSensorIsActive,
                AlarmActivated = settings.AlarmActivated,
                DataSendingSpan = settings.DataSendingSpan,
                DeviationSpan = settings.DeviationSpan
            };
        }
    }
}
