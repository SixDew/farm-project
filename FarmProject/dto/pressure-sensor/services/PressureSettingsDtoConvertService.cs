using FarmProject.db.models;
using FarmProject.dto.pressure_sensor.settings;

namespace FarmProject.dto.servisces
{
    public class PressureSettingsDtoConvertService
    {
        public PressureSensorSettingsToAdminClientDto ConvertToAdminClient(SensorSettings settings)
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

        public PressureSensorSettingsToClientDto ConvertToClient(SensorSettings settings)
        {
            return new PressureSensorSettingsToClientDto()
            {
                AlarmActivated = settings.AlarmActivated,
                IMEI = settings.IMEI,
            };
        }


        public SensorSettings ConvertFromClient(PressureSensorSettingsFromClientDto settings, string imei)
        {
            return new SensorSettings
            {
                IMEI = imei,
                AlarmActivated = settings.AlarmActivated,
            };
        }

        public SensorSettings ConvertFromAdminClient(PressureSensorSettingsFromAdminClientDto settings, string imei)
        {
            return new SensorSettings
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

        public SensorSettings ConvertFromClient(PressureSensorSettingsFromClientDto settingsFromClient,
            SensorSettings settingsToUpdate)
        {
            settingsToUpdate.AlarmActivated = settingsFromClient.AlarmActivated;
            return settingsToUpdate;
        }

        public SensorSettings ConvertFromAdminClient(PressureSensorSettingsFromAdminClientDto settingsFromClient,
            SensorSettings settingsToUpdate)
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

        public PressureSettingsToSensorDto ConvertToSensor(SensorSettings settings)
        {
            return new()
            {
                AlarmActivated = settings.AlarmActivated,
                DataSendingSpan = settings.DataSendingSpan,
                DeviationSpanNegative = settings.DeviationSpanNegative,
                DeviationSpanPositive = settings.DeviationSpanPositive,
                FirstSensorIsActive = settings.FirstSensorIsActive,
                SecondSensorIsActive = settings.SecondSensorIsActive,
                Sensitivity = settings.Sensitivity
            };
        }
    }
}
