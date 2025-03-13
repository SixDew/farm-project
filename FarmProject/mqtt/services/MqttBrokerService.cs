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
        Console.WriteLine("Обработка сообщения");
        using (var scope = _serviceProvider.CreateScope())
        {
            string topic = e.ApplicationMessage.Topic;
            Console.WriteLine("Топик сообщение: " + topic);
            var sensorProvider = scope.ServiceProvider.GetRequiredService<PressureSensorProvider>();

            switch (topic)
            {
                case "sensors/pressure/measurements/add":
                    {
                        try
                        {
                            Console.WriteLine("Добавление измерения");

                            Console.WriteLine($"Нагрузка: {Encoding.UTF8.GetString(e.ApplicationMessage.Payload)}");

                            var data = JsonSerializer.Deserialize<PressureMeasurementsFromSensorDto>(Encoding.UTF8.GetString(e.ApplicationMessage.Payload));

                            Console.WriteLine($"""
                                IMEI: {data.IMEI},
                                Измерение 1: {data.PRR1},
                                Измерение 2: {data.PRR2}
                                """);

                            var validationService = scope.ServiceProvider.GetRequiredService<PressureValidationService>();
                            var dtoConverter = scope.ServiceProvider.GetRequiredService<PressureMeasurmentsDtoConvertService>();

                            Console.WriteLine("Валидация");
                            if (await validationService.IsValidatedAsync(data.IMEI))
                            {
                                Console.WriteLine("Поиск датчика");
                                var sensorMeasurementsList = await sensorProvider.GetMeasurmentsByImeiAync(data.IMEI);

                                Console.WriteLine("Конвертация");
                                var measurementsModel = dtoConverter.ConvertToModel(data);
                                Console.WriteLine("Добавление");
                                sensorMeasurementsList.Add(measurementsModel);
                                Console.WriteLine("Сохранение");
                                await sensorProvider.SaveChangesAsync();
                                Console.WriteLine("Завершение");
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

    public async Task ClientConnected(ClientConnectedEventArgs e)
    {
        Console.WriteLine($"Подключение установлено: {e.ClientId}");
    }
}
