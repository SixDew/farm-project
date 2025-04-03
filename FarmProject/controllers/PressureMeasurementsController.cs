using FarmProject.auth;
using FarmProject.db.services.providers;
using FarmProject.dto;
using FarmProject.dto.pressure_sensor.services;
using FarmProject.dto.pressure_sensor.settings;
using FarmProject.dto.servisces;
using FarmProject.mqtt.services;
using FarmProject.validation.services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FarmProject.controllers;

[ApiController]
[Route("sensors/pressure")]
public class PressureMeasurementsController(PressureSensorProvider sensorProvider,
    PressureMeasurmentsDtoConvertService dtoConverter, MqttBrokerService sensorsBroker) : ControllerBase
{
    [HttpGet("measurements/{imei}")]
    public async Task<IActionResult> GetPressureMeasurment([FromRoute] string imei)
    {
        var measurments = await sensorProvider.GetMeasurmentsByImeiAync(imei);
        if (measurments is null) return NotFound(new { message = "Imei is incorrect" });

        List<PressureMeasurementsToClientDto> measurmentsDtoList = measurments.Select(m => dtoConverter.ConvertToClientDto(m)).ToList();

        return Ok(measurmentsDtoList);
    }
    [HttpPost("measurements")]
    public async Task<IActionResult> PostPressureMeasurments([FromBody] PressureMeasurementsFromSensorDto measurements,
        [FromServices] PressureValidationService validationService)
    {
        if (!await validationService.IsValidatedAsync(measurements.IMEI)) return NotFound(new { message = "Sensor is invalid" });

        var sensorMeasurementsList = await sensorProvider.GetMeasurmentsByImeiAync(measurements.IMEI);
        var measurementsModel = dtoConverter.ConvertToModel(measurements);
        sensorMeasurementsList.Add(measurementsModel);
        await sensorProvider.SaveChangesAsync();

        return Created($"sensors/pressure/measurements/{measurements.IMEI}", dtoConverter.ConvertToClientDto(measurementsModel));
    }

    [HttpGet("settings/{imei}")]
    [Authorize(Roles = UserRoles.USER)]
    public async Task<IActionResult> GetSettings([FromRoute] string imei,
        [FromServices] PressureSettingsDtoConvertService settingsConverter)
    {
        var settings = await sensorProvider.GetSettingsByImeiAsync(imei);
        if (settings is null) return NotFound(new { message = "Sensor is not exist" });

        return Ok(settingsConverter.ConvertToClient(settings));
    }
    [HttpPut("settings/{imei}")]
    [Authorize(Roles = $"{UserRoles.USER},{UserRoles.ADMIN}")]
    public async Task<IActionResult> UpdateSetting([FromRoute] string imei,
        [FromServices] PressureSettingsDtoConvertService settingsConverter,
        [FromBody] PressureSensorSettingsFromClientDto settingsFromClient)
    {
        var settings = await sensorProvider.GetSettingsByImeiAsync(imei);
        if (settings is null) return NotFound(new { message = "Sensor is not exist" });

        settingsConverter.ConvertFromClient(settingsFromClient, settings);

        await sensorProvider.SaveChangesAsync();

        await sensorsBroker.SendPressureSettingsToSensorAsync(settingsConverter.ConvertToSensor(settings), imei);

        return Ok(settingsConverter.ConvertToClient(settings));

    }
    [HttpGet("admin/settings/{imei}")]
    [Authorize(Roles = UserRoles.ADMIN)]
    public async Task<IActionResult> GetAdminSettings([FromRoute] string imei,
        [FromServices] PressureSettingsDtoConvertService settingsConverter)
    {
        var settings = await sensorProvider.GetSettingsByImeiAsync(imei);
        if (settings is null) return NotFound(new { message = "Sensor is not exist" });

        return Ok(settingsConverter.ConvertToAdminClient(settings));
    }
    [HttpPut("admin/settings/{imei}")]
    [Authorize(Roles = UserRoles.ADMIN)]
    public async Task<IActionResult> UpdateAdminSetting([FromRoute] string imei,
        [FromServices] PressureSettingsDtoConvertService settingsConverter,
        [FromBody] PressureSensorSettingsFromAdminClientDto settingsFromClient)
    {
        var settings = await sensorProvider.GetSettingsByImeiAsync(imei);
        if (settings is null) return NotFound(new { message = "Sensor is not exist" });

        settingsConverter.ConvertFromAdminClient(settingsFromClient, settings);

        await sensorProvider.SaveChangesAsync();

        await sensorsBroker.SendPressureSettingsToSensorAsync(settingsConverter.ConvertToSensor(settings), imei);

        return Ok(settingsConverter.ConvertToAdminClient(settings));

    }

    [HttpPost]
    public async Task<IActionResult> AddSensor([FromBody] AddSensorFromClientDto sensorData,
        [FromServices] PressureSensorDtoConvertService converter)
    {
        var sensor = await sensorProvider.GetByImeiWithMeasurementsAndSettingsAsync(sensorData.IMEI);
        if (sensor is null)
        {
            sensor = converter.ConvertToModel(sensorData);
            await sensorProvider.AddAsync(sensor);
            await sensorProvider.SaveChangesAsync();
        }

        return Created($"sensors/pressure/{sensorData.IMEI}", converter.ConvertToClient(sensor));
    }
    [HttpGet("{imei}")]
    [Authorize(Roles = $"{UserRoles.USER},{UserRoles.ADMIN}")]
    public async Task<IActionResult> GetSensor([FromRoute] string imei,
        [FromServices] PressureSensorDtoConvertService converter)
    {
        var sensor = await sensorProvider.GetByImeiWithMeasurementsAndSettingsAsync(imei);
        if (sensor is null) return NotFound(new { message = "Sensor is not exist" });

        return Ok(converter.ConvertToClient(sensor));
    }

    [HttpGet]
    [Authorize(Roles = $"{UserRoles.USER},{UserRoles.ADMIN}")]
    public async Task<IActionResult> GetSensors([FromServices] PressureSensorDtoConvertService converter)
    {
        var sensors = await sensorProvider.GetAllAsync();
        if (sensors is null) return NotFound();

        return Ok(sensors.Select(converter.ConvertToClient).ToList());
    }

    [HttpDelete("{imei}")]
    public async Task<IActionResult> DeleteSensor([FromRoute] string imei)
    {
        var sensor = await sensorProvider.GetByImeiAsync(imei);

        if (sensor is not null) sensorProvider.Delete(sensor);

        await sensorProvider.SaveChangesAsync();
        return Ok();
    }

    [HttpGet("measurements/alarms/{imei}")]
    [Authorize(Roles = $"{UserRoles.USER},{UserRoles.ADMIN}")]
    public async Task<IActionResult> GetAlarmedMeasurements([FromRoute] string imei, PressureAlarmDtoConvertService converter)
    {
        var alarmedMeasurementsList = await sensorProvider.GetAlarmedMeasurementsAsync(imei);
        if (alarmedMeasurementsList is null)
        {
            return NotFound();
        }

        return Ok(alarmedMeasurementsList.Select(converter.ConvertToHubAlarmToClientDto));
    }

    [HttpPost("measurements/alarms/{imei}/check/{id}")]
    [Authorize(Roles = $"{UserRoles.USER},{UserRoles.ADMIN}")]
    public async Task<IActionResult> CheckAlarmedMeasurement([FromRoute] int id, [FromRoute] string imei)
    {
        var alarmedMeasurementsList = await sensorProvider.GetAlarmedMeasurementsAsync(imei);
        if (alarmedMeasurementsList is null)
        {
            return NotFound();
        }

        var alarmedMeasurement = alarmedMeasurementsList.FirstOrDefault(am => am.Id == id);
        if (alarmedMeasurement is null)
        {
            return NotFound();
        }

        alarmedMeasurement.isChecked = true;
        await sensorProvider.SaveChangesAsync();
        return Ok();
    }

    [HttpGet("disabled")]
    [Authorize(Roles = $"{UserRoles.USER},{UserRoles.ADMIN}")]
    public async Task<IActionResult> GetDisabledSensors([FromServices] PressureSensorDtoConvertService converter)
    {
        var disabledSensors = await sensorProvider.GetDisabled();
        return Ok(disabledSensors.Select(converter.ConvertToClient));
    }
}