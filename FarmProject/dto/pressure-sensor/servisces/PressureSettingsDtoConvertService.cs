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

        public PressureSensorSettings ConvertFromClient(PressureSensorSettingsFromClientDto settings, string imei)
        {
            return new PressureSensorSettings
            {
                Sensitivity = settings.Sensitivity,
                SecondSensorIsActive = settings.SecondSensorIsActive,
                IMEI = imei,
                FirstSensorIsActive = settings.FirstSensorIsActive,
                AlarmActivated = settings.AlarmActivated,
                DataSendingSpan = settings.DataSendingSpan,
                DeviationSpan = settings.DeviationSpan
            };
        }

        public PressureSensorSettings ConvertFromClient(PressureSensorSettingsFromClientDto settingsFromClient,
            PressureSensorSettings settingsToUpdate)
        {
            settingsToUpdate.Sensitivity = settingsFromClient.Sensitivity;
            settingsToUpdate.SecondSensorIsActive = settingsFromClient.SecondSensorIsActive;
            settingsToUpdate.FirstSensorIsActive = settingsFromClient.FirstSensorIsActive;
            settingsToUpdate.AlarmActivated = settingsFromClient.AlarmActivated;
            settingsToUpdate.DeviationSpan = settingsFromClient.DeviationSpan;
            settingsToUpdate.DataSendingSpan = settingsFromClient.DataSendingSpan;

            return settingsToUpdate;
        }
    }
}
