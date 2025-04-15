using FarmProject.auth;
using FarmProject.db.services.providers;
using FarmProject.dto.groups.services;
using FarmProject.group_feature;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace FarmProject.controllers
{
    [ApiController]
    [Route("/facilities")]
    public class FacilityController(FacilityProvider _facilityProvider, FacilityConverter _facilityConverter) : ControllerBase
    {
        [HttpGet]
        [Authorize(Roles = $"{UserRoles.USER},{UserRoles.ADMIN}")]
        public async Task<IActionResult> GetFacilities()
        {
            return Ok((await _facilityProvider.GetAllAsync()).Select(_facilityConverter.ConvertToClient));
        }

        [HttpGet("metadata")]
        [Authorize(Roles = $"{UserRoles.USER},{UserRoles.ADMIN}")]
        public async Task<IActionResult> GetFacilitiesMeta()
        {
            return Ok((await _facilityProvider.GetAllDeepMetaAsync()).Select(_facilityConverter.ConvertToClient));
        }

        [HttpGet("{id}")]
        [Authorize(Roles = $"{UserRoles.USER},{UserRoles.ADMIN}")]
        public async Task<IActionResult> GetFacility([FromRoute] int id)
        {
            var facility = await _facilityProvider.GetWithInnerDataAsync(id);
            if (facility is null)
            {
                return BadRequest();
            }
            return Ok(_facilityConverter.ConvertToClient(facility));
        }

        [HttpPost]
        [Authorize(Roles = $"{UserRoles.ADMIN}")]
        public async Task<IActionResult> AddFacility([FromBody] string name)
        {
            var facility = new Facility()
            {
                Name = name,
            };
            await _facilityProvider.AddAsync(facility);
            await _facilityProvider.SaveChangesAsync();
            return Created($"/facilities/{facility.Id}", _facilityConverter.ConvertToClient(facility));
        }
    }
}
