using FarmProject.db.services.providers;
using FarmProject.dto;
using FarmProject.dto.servisces;
using FarmProject.hubs.services;
using FarmProject.validation.services;
using MQTTnet.Server;
using System.Text;
using System.Text.Json;

namespace FarmProject.mqtt.services;

public class MqttBrokerService(IServiceProvider _serviceProvider, MeasurementsHubService measurementsHubService)
{
    private readonly MeasurementsHubService _measurementsHubService = measurementsHubService;

    public async Task InterceptingPublishAsync(InterceptingPublishEventArgs e)
    {
        using (var scope = _serviceProvider.CreateScope())
        {
            string topic = e.ApplicationMessage.Topic;
            var sensorProvider = scope.ServiceProvider.GetRequiredService<PressureSensorProvider>();

            switch (topic)
            {
                case "sensors/pressure/measurements/add":
                    {
                        try
                        {
                            var data = JsonSerializer.Deserialize<PressureMeasurementsFromSensorDto>(Encoding.UTF8.GetString(e.ApplicationMessage.Payload));

                            var validationService = scope.ServiceProvider.GetRequiredService<PressureValidationService>();
                            var dtoConverter = scope.ServiceProvider.GetRequiredService<PressureMeasurmentsDtoConvertService>();

                            if (await validationService.IsValidatedAsync(data.IMEI))
                            {
                                var sensorMeasurementsList = await sensorProvider.GetMeasurmentsByImeiAync(data.IMEI);

                                var measurementsModel = dtoConverter.ConvertToModel(data);
                                sensorMeasurementsList.Add(measurementsModel);
                                await sensorProvider.SaveChangesAsync();

                                await _measurementsHubService.SendMeasurementsAsync(new hubs.HubMeasurementsData { Measurement1 = data.PRR1, Measurement2 = data.PRR2 }, data.IMEI);
                            }
                        }
                        catch (JsonException ex)
                        {
                            Console.Error.WriteLine($"Sensor measurements deserialization error: {ex.Message}");
                        }

                        break;
                    }
                case "sensors/pressure/add":
                    {
                        try
                        {
                            var data = JsonSerializer.Deserialize<AddSensorFromClientDto>(Encoding.UTF8.GetString(e.ApplicationMessage.Payload));

                            var converter = scope.ServiceProvider.GetRequiredService<PressureSensorDtoConvertService>();

                            var sensor = await sensorProvider.GetByImeiWithMeasurementsAndSettingsAsync(data.IMEI);
                            if (sensor is null)
                            {
                                sensor = converter.ConvertToModel(data);
                                await sensorProvider.AddAsync(sensor);
                                await sensorProvider.SaveChangesAsync();
                            }
                        }
                        catch (JsonException ex)
                        {
                            Console.Error.WriteLine($"Sensor deserialization error: {ex.Message}");
                        }

                        break;
                    }
            }
        }
    }
}
