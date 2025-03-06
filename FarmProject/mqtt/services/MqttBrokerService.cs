using FarmProject.alarm.services;
using FarmProject.db.services.providers;
using FarmProject.dto;
using FarmProject.dto.pressure_sensor.measurements;
using FarmProject.dto.pressure_sensor.settings;
using FarmProject.dto.servisces;
using FarmProject.hubs.services;
using FarmProject.validation.services;
using MQTTnet;
using MQTTnet.Protocol;
using MQTTnet.Server;
using System.Text;
using System.Text.Json;

namespace FarmProject.mqtt.services;

public class MqttBrokerService(IServiceProvider _serviceProvider, MeasurementsHubService measurementsHubService,
    MqttServer _mqttServer)
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
                            var alarmChecker = scope.ServiceProvider.GetRequiredService<AlarmPressureMeasurementsChecker>();

                            if (await validationService.IsValidatedAsync(data.IMEI))
                            {
                                var sensorMeasurementsList = await sensorProvider.GetMeasurmentsByImeiAync(data.IMEI);

                                var measurementsModel = dtoConverter.ConvertToModel(data);
                                sensorMeasurementsList.Add(measurementsModel);

                                await sensorProvider.SaveChangesAsync();
                                await _measurementsHubService.SendMeasurementsAsync(new HubPressureMeasurementsToClientDto
                                {
                                    Measurement1 = measurementsModel.PRR1,
                                    Measurement2 = measurementsModel.PRR2,
                                    MeasurementsTime = measurementsModel.MeasurementsTime,
                                    Imei = data.IMEI,
                                }, data.IMEI);

                                if (await alarmChecker.isAlarmRequredAsync(measurementsModel))
                                {
                                    var alarmService = scope.ServiceProvider.GetRequiredService<AlarmPressureSensorService>();
                                    await alarmService.SendAlarmNotifyAsync(measurementsModel);
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            Console.Error.WriteLine($"Measurements safe error: {ex.Message}");
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

    public async Task ValidateEvent(ValidatingConnectionEventArgs e)
    {
        using (var scope = _serviceProvider.CreateScope())
        {
            var validationService = scope.ServiceProvider.GetRequiredService<PressureValidationService>();

            string? imei = e.UserProperties?.FirstOrDefault(x => x.Name == "imei")?.Value;
            if (imei is null || !await validationService.IsValidatedAsync(imei))
            {
                e.ReasonCode = MqttConnectReasonCode.ClientIdentifierNotValid;
                return;
            }

            e.ReasonCode = MqttConnectReasonCode.Success;
        }
    }

    public async Task ConnectedEvent(ClientConnectedEventArgs e)
    {
        string? imei = e.UserProperties?.FirstOrDefault(x => x.Name == "imei")?.Value;
        if (imei is null)
        {
            return;
        }
        else
        {
            await _mqttServer.SubscribeAsync(e.ClientId, $"sensors/pressure/settings/get/{imei}");
        }

    }

    public async Task SendPressureSettingsToSensorAsync(PressureSettingsToSensorDto settings, string imei)
    {
        var message = new MqttApplicationMessageBuilder().WithTopic($"sensors/pressure/settings/get/{imei}")
            .WithPayload(JsonSerializer.Serialize(settings))
            .WithQualityOfServiceLevel(MqttQualityOfServiceLevel.AtLeastOnce)
            .Build();
        await _mqttServer.InjectApplicationMessage(new InjectedMqttApplicationMessage(message)
        {
            SenderClientId = "server"
        });
    }
}
