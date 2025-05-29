using System.Security.Claims;
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
    public class FacilityController(FacilityProvider _facilityProvider, FacilityConverter _facilityConverter, UserAccessService _accessService) : ControllerBase
    {
        [HttpGet]
        [Authorize(Roles = $"{UserRoles.ADMIN}")]
        public async Task<IActionResult> GetFacilities()
        {
            return Ok((await _facilityProvider.GetAllAsync()).Select(_facilityConverter.ConvertToClient));
        }

        [HttpGet("metadata")]
        [Authorize(Roles = $"{UserRoles.ADMIN}")]
        public async Task<IActionResult> GetFacilitiesMeta()
        {
            return Ok((await _facilityProvider.GetAllDeepMetaAsync()).Select(_facilityConverter.ConvertToClient));
        }

        [HttpGet("meta/{id}")]
        [Authorize(Roles = $"{UserRoles.USER},{UserRoles.ADMIN}")]
        public async Task<IActionResult> GetFacilityMeta([FromRoute] int id)
        {
            if (User.FindFirstValue(ClaimTypes.Role) == UserRoles.USER &&
                !await _accessService.CheckFacilityAffiliation(int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!), id))
            {
                return Forbid();
            }
            var facilityMeta = await _facilityProvider.GetDeepMetaAsync(id);
            if (facilityMeta is null)
            {
                return BadRequest();
            }
            return Ok(_facilityConverter.ConvertToClient(facilityMeta));
        }

        [HttpGet("{id}")]
        [Authorize(Roles = $"{UserRoles.USER},{UserRoles.ADMIN}")]
        public async Task<IActionResult> GetFacility([FromRoute] int id)
        {
            if (User.FindFirstValue(ClaimTypes.Role) == UserRoles.USER &&
                !await _accessService.CheckFacilityAffiliation(int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!), id))
            {
                return Forbid();
            }
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
