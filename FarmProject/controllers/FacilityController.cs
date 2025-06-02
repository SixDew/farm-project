using System.Security.Claims;
using FarmProject.auth;
using FarmProject.db.services.providers;
using FarmProject.dto.groups;
using FarmProject.dto.groups.services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace FarmProject.controllers
{
    [ApiController]
    [Route("/facilities")]
    public class FacilityController(FacilityProvider _facilityProvider, FacilityConverter _facilityConverter,
        UserAccessService _accessService, SectionsProvider _sections, SensorGroupsProvider _groups, UserProvider _users,
        SensorsProvider _sensors) : ControllerBase
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

        [HttpGet("main-data")]
        [Authorize(Roles = $"{UserRoles.ADMIN}")]
        public async Task<IActionResult> GetFacilitiesMainData()
        {
            var facilities = await _facilityProvider.GetAllMainData();
            return Ok(facilities.Select(_facilityConverter.ConvertMainDataToClient));
        }

        [HttpPost]
        [Authorize(Roles = $"{UserRoles.ADMIN}")]
        public async Task<IActionResult> AddFacility([FromBody] AddFacilityDto data)
        {
            var facility = _facilityConverter.ConvertFrom(data);
            if (!(facility.Inn.Length is 10 or 12 && facility.Inn.All(char.IsDigit)) ||
                !(facility.Ogrn.Length is 13 or 15 && facility.Ogrn.All(char.IsDigit))) return BadRequest();
            var groups = facility.Groups;
            var sections = facility.Sections;

            facility.Groups = [];
            facility.Sections = [];

            try
            {
                await _facilityProvider.AddAsync(facility);
                await _facilityProvider.SaveChangesAsync();
            }
            catch (Exception ex) { return BadRequest(); }

            groups.ForEach(g => g.FacilityId = facility.Id);
            sections.ForEach(s => s.FacilityId = facility.Id);
            facility.Sections = sections;
            facility.Groups = groups;
            await _facilityProvider.SaveChangesAsync();

            return Created($"/facilities/{facility.Id}", _facilityConverter.ConvertToClient(facility));
        }

        [HttpPut]
        [Authorize(Roles = $"{UserRoles.ADMIN}")]
        public async Task<IActionResult> UpdateFacilityData([FromBody] MainDataFacilityDto data)
        {
            var facility = await _facilityProvider.GetAsync(data.Id);
            if (facility is null) return BadRequest();
            var facilty = _facilityConverter.UpdateFacility(facility, data);
            if (!(facility.Inn.Length is 10 or 12 && facility.Inn.All(char.IsDigit)) ||
                !(facility.Ogrn.Length is 13 or 15 && facility.Ogrn.All(char.IsDigit))) return BadRequest();

            try { await _facilityProvider.SaveChangesAsync(); }
            catch (Exception ex) { return BadRequest(); }
            return Ok(_facilityConverter.ConvertToClient(facility));
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = $"{UserRoles.ADMIN}")]
        public async Task<IActionResult> DeleteFacility([FromRoute] int id)
        {
            var facility = await _facilityProvider.GetAsync(id);
            if (facility is not null)
            {
                var users = await _users.GetAllFacilityUsersAsync(id);
                users.ForEach(_users.Delete);
                await _users.SaveChangesAsync();

                var sensors = await _sensors.GetAllFacilitySensors(id);
                sensors.ForEach(_sensors.Delete);
                await _sensors.SaveChangesAsync();

                _facilityProvider.Delete(facility);
                await _facilityProvider.SaveChangesAsync();
            }
            return Ok(_facilityConverter.ConvertToClient(facility));
        }
    }
}
