using FarmProject.auth;
using FarmProject.db.services.providers;
using FarmProject.dto.map;
using FarmProject.dto.map.services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace FarmProject.controllers
{
    [ApiController]
    [Route("/map")]
    public class MapController(MapZonesProvider _zones, MapZoneConverter _zoneConverter) : ControllerBase
    {
        [HttpGet("zones")]
        [Authorize(Roles = $"{UserRoles.USER},{UserRoles.ADMIN}")]
        public async Task<IActionResult> GetZones()
        {
            return Ok((await _zones.GetAllAsync()).Select(_zoneConverter.ConvertToClient));
        }
        [HttpPost("zones")]
        [Authorize(Roles = $"{UserRoles.ADMIN}")]
        public async Task<IActionResult> AddZone([FromBody] MapZoneFromClientDto zone)
        {
            var zoneModel = _zoneConverter.ConvertToModel(zone);
            await _zones.AddAsync(zoneModel);
            await _zones.SaveChangesAsync();
            return Created($"/zones/{zoneModel.Id}", _zoneConverter.ConvertToClient(zoneModel));
        }
        [HttpGet("zones/{id}")]
        [Authorize(Roles = $"{UserRoles.USER},{UserRoles.ADMIN}")]
        public async Task<IActionResult> GetZone([FromRoute] int id)
        {
            var zone = await _zones.GetAsync(id);
            if (zone is null) return BadRequest("zone is not exist");
            return Ok(_zoneConverter.ConvertToClient(zone));
        }
        [HttpDelete("zones/{id}")]
        [Authorize(Roles = $"{UserRoles.ADMIN}")]
        public async Task<IActionResult> DeleteZone([FromRoute] int id)
        {
            var zone = await _zones.GetAsync(id);
            if (zone is null) return Ok();
            _zones.Delete(zone);
            _zones.SaveChanges();
            return Ok();
        }
        [HttpPut("zones/{id}")]
        [Authorize(Roles = $"{UserRoles.ADMIN}")]
        public async Task<IActionResult> EditZone([FromRoute] int id, [FromBody] MapZoneFromClientDto data)
        {
            var zone = await _zones.GetAsync(id);
            if (zone is null) return BadRequest("zone is not exist");
            zone.Geometry = data.Geometry;
            await _zones.SaveChangesAsync();
            return Ok(_zoneConverter.ConvertToClient(zone));
        }
    }
}
