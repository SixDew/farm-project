using FarmProject.db.models;
using FarmProject.dto.pressure_sensor.settings;

namespace FarmProject.dto.servisces
{
    public class PressureSettingsDtoConvertService
    {
        public PressureSensorSettingsToAdminClientDto ConvertToAdminClient(PressureSensorSettings settings)
        {
            return new PressureSensorSettingsToAdminClientDto()
            {
                AlarmActivated = settings.AlarmActivated,
                DataSendingSpan = settings.DataSendingSpan,
                DeviationSpanPositive = settings.DeviationSpanPositive,
                DeviationSpanNegative = settings.DeviationSpanNegative,
                FirstSensorIsActive = settings.FirstSensorIsActive,
                IMEI = settings.IMEI,
                SecondSensorIsActive = settings.SecondSensorIsActive,
                Sensitivity = settings.Sensitivity
            };
        }

        public PressureSensorSettingsToClientDto ConvertToClient(PressureSensorSettings settings)
        {
            return new PressureSensorSettingsToClientDto()
            {
                AlarmActivated = settings.AlarmActivated,
                IMEI = settings.IMEI,
            };
        }


        public PressureSensorSettings ConvertFromClient(PressureSensorSettingsFromClientDto settings, string imei)
        {
            return new PressureSensorSettings
            {
                IMEI = imei,
                AlarmActivated = settings.AlarmActivated,
            };
        }

        public PressureSensorSettings ConvertFromAdminClient(PressureSensorSettingsFromAdminClientDto settings, string imei)
        {
            return new PressureSensorSettings
            {
                Sensitivity = settings.Sensitivity,
                SecondSensorIsActive = settings.SecondSensorIsActive,
                IMEI = imei,
                FirstSensorIsActive = settings.FirstSensorIsActive,
                AlarmActivated = settings.AlarmActivated,
                DataSendingSpan = settings.DataSendingSpan,
                DeviationSpanPositive = settings.DeviationSpanPositive,
                DeviationSpanNegative = settings.DeviationSpanNegative,
            };
        }

        public PressureSensorSettings ConvertFromClient(PressureSensorSettingsFromClientDto settingsFromClient,
            PressureSensorSettings settingsToUpdate)
        {
            settingsToUpdate.AlarmActivated = settingsFromClient.AlarmActivated;
            return settingsToUpdate;
        }

        public PressureSensorSettings ConvertFromAdminClient(PressureSensorSettingsFromAdminClientDto settingsFromClient,
            PressureSensorSettings settingsToUpdate)
        {
            settingsToUpdate.Sensitivity = settingsFromClient.Sensitivity;
            settingsToUpdate.SecondSensorIsActive = settingsFromClient.SecondSensorIsActive;
            settingsToUpdate.FirstSensorIsActive = settingsFromClient.FirstSensorIsActive;
            settingsToUpdate.AlarmActivated = settingsFromClient.AlarmActivated;
            settingsToUpdate.DeviationSpanPositive = settingsFromClient.DeviationSpanPositive;
            settingsToUpdate.DeviationSpanNegative = settingsFromClient.DeviationSpanNegative;
            settingsToUpdate.DataSendingSpan = settingsFromClient.DataSendingSpan;

            return settingsToUpdate;
        }
    }
}
