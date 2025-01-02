using FarmProject.db.services.providers;
using FarmProject.dto;
using FarmProject.dto.servisces;
using Microsoft.AspNetCore.Mvc;

namespace FarmProject.controllers;

[ApiController]
[Route("sensors/pressure")]
public class PressureMeasurmentsController(PressureSensorProvider sensorProvider) : ControllerBase
{
    [HttpGet("measurements/{imei}")]
    public async Task<IActionResult> GetPressureMeasurment([FromRoute] string imei,
        [FromServices] PressureMeasurmentsDtoConvertService dtoConverter)
    {
        var measurments = await sensorProvider.GetMeasurmentsByImeiAync(imei);
        if (measurments is null) return NotFound(new { message = "Imei is incorrect" });

        List<PressureMeasurmentsDto> measurmentsDtoList = measurments.Select(m => dtoConverter.Convert(m)).ToList();

        return Ok(measurmentsDtoList);
    }
}