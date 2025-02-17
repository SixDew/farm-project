using FarmProject.db.services.providers;
using FarmProject.dto;
using FarmProject.dto.servisces;
using FarmProject.validation.services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FarmProject.controllers;

[ApiController]
[Route("sensors/pressure")]
public class PressureMeasurementsController(PressureSensorProvider sensorProvider,
    PressureMeasurmentsDtoConvertService dtoConverter) : ControllerBase
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
    [Authorize(Roles = "user")]
    public async Task<IActionResult> GetSettings([FromRoute] string imei,
        [FromServices] PressureSettingsDtoConvertService settingsConverter)
    {
        var settings = await sensorProvider.GetSettingsByImeiAsync(imei);
        if (settings is null) return NotFound(new { message = "Sensor is not exist" });

        return Ok(settingsConverter.ConvertToClient(settings));
    }
    [HttpPut("settings/{imei}")]
    [Authorize(Roles = "user")]
    public async Task<IActionResult> UpdateSetting([FromRoute] string imei,
        [FromServices] PressureSettingsDtoConvertService settingsConverter,
        [FromBody] PressureSensorSettingsFromClientDto settingsFromClient)
    {
        var settings = await sensorProvider.GetSettingsByImeiAsync(imei);
        if (settings is null) return NotFound(new { message = "Sensor is not exist" });

        settingsConverter.ConvertFromClient(settingsFromClient, settings);

        await sensorProvider.SaveChangesAsync();

        return Ok(settingsConverter.ConvertToClient(settings));

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
    [Authorize(Roles = "user")]
    public async Task<IActionResult> GetSensor([FromRoute] string imei,
        [FromServices] PressureSensorDtoConvertService converter)
    {
        var sensor = await sensorProvider.GetByImeiWithMeasurementsAndSettingsAsync(imei);
        if (sensor is null) return NotFound(new { message = "Sensor is not exist" });

        return Ok(converter.ConvertToClient(sensor));
    }

    [HttpGet]
    [Authorize(Roles = "user")]
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
}