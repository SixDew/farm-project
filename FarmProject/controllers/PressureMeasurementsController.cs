using FarmProject.db.services.providers;
using FarmProject.dto;
using FarmProject.dto.servisces;
using Microsoft.AspNetCore.Mvc;

namespace FarmProject.controllers;

[ApiController]
[Route("sensors/pressure")]
public class PressureMeasurementsController(PressureSensorProvider sensorProvider) : ControllerBase
{
    [HttpGet("measurements/{imei}")]
    public async Task<IActionResult> GetPressureMeasurment([FromRoute] string imei,
        [FromServices] PressureMeasurmentsDtoConvertService dtoConverter)
    {
        var measurments = await sensorProvider.GetMeasurmentsByImeiAync(imei);
        if (measurments is null) return NotFound(new { message = "Imei is incorrect" });

        List<PressureMeasurementsToClientDto> measurmentsDtoList = measurments.Select(m => dtoConverter.ConvertToClientDto(m)).ToList();

        return Ok(measurmentsDtoList);
    }
    [HttpPost("measurements/{imei}")]
    public async Task<IActionResult> PostPressureMeasurments([FromRoute] string imei,
        [FromBody] PressureMeasurementsFromSensorDto measurements)
    {

    }
}