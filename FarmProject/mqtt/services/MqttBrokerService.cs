using FarmProject.db.services.providers;
using FarmProject.dto;
using FarmProject.dto.servisces;
using FarmProject.validation.services;
using MQTTnet.Server;
using System.Text;
using System.Text.Json;

namespace FarmProject.mqtt.services;

public class MqttBrokerService(IServiceProvider _serviceProvider)
{
    public async Task InterceptingPublishAsync(InterceptingPublishEventArgs e)
    {
        using (var scope = _serviceProvider.CreateScope())
        {
            string topic = e.ApplicationMessage.Topic;

            switch (topic)
            {
                case "sensors/pressure/measurements/add":
                    {
                        try
                        {
                            var data = JsonSerializer.Deserialize<PressureMeasurementsFromSensorDto>(Encoding.UTF8.GetString(e.ApplicationMessage.Payload));

                            var sensorProvider = scope.ServiceProvider.GetRequiredService<PressureSensorProvider>();
                            var validationService = scope.ServiceProvider.GetRequiredService<PressureValidationService>();
                            var dtoConverter = scope.ServiceProvider.GetRequiredService<PressureMeasurmentsDtoConvertService>();

                            if (await validationService.IsValidatedAsync(data.IMEI))
                            {
                                var sensorMeasurementsList = await sensorProvider.GetMeasurmentsByImeiAync(data.IMEI);

                                var measurementsModel = dtoConverter.ConvertToModel(data);
                                sensorMeasurementsList.Add(measurementsModel);
                                await sensorProvider.SaveChangesAsync();
                            }
                        }
                        catch (JsonException ex)
                        {
                            Console.Error.WriteLine($"Sensor data deserialization error: {ex.Message}");
                        }

                        break;
                    }
            }
        }
    }
}
