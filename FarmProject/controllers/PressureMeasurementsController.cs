using FarmProject.db.services.providers;
using FarmProject.dto;
using FarmProject.dto.servisces;
using FarmProject.validation.services;
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
        if (!await validationService.IsValidated(measurements.IMEI)) return NotFound(new { message = "Sensor is invalid" });

        var sensorMeasurementsList = await sensorProvider.GetMeasurmentsByImeiAync(measurements.IMEI);
        var measurementsModel = dtoConverter.ConvertToModel(measurements);
        sensorMeasurementsList.Add(measurementsModel);
        await sensorProvider.SaveChangesAsync();

        return Created($"sensors/pressure/measurements/{measurements.IMEI}", dtoConverter.ConvertToClientDto(measurementsModel));
    }

    [HttpGet("settings/{imei}")]
    public async Task<IActionResult> GetSettings([FromRoute] string imei,
        [FromServices] PressureSettingsDtoConvertService settingsConverter)
    {
        var settings = await sensorProvider.GetSettingsByImeiAsync(imei);
        if (settings is null) return NotFound(new { message = "Sensor is not exist" });

        return Ok(settingsConverter.ConvertToClient(settings));
    }
}