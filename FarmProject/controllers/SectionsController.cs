using FarmProject.auth;
using FarmProject.db.services.providers;
using FarmProject.dto.groups;
using FarmProject.dto.groups.services;
using FarmProject.group_feature.section;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace FarmProject.controllers
{
    [ApiController]
    [Route("/sections")]
    public class SectionsController(SectionsProvider _sections, SectionConverter _converter) : ControllerBase
    {
        [HttpGet]
        [Authorize(Roles = $"{UserRoles.USER},{UserRoles.ADMIN}")]
        public async Task<IActionResult> GetSections()
        {
            var sectionsList = await _sections.GetAllAsync();
            return Ok(sectionsList.Select(_converter.ConvertToClientDto));
        }

        [HttpPost("add/{facilityId}")]
        [Authorize(Roles = $"{UserRoles.ADMIN}")]
        public async Task<IActionResult> AddSection([FromBody] string name, [FromRoute] int facilityId)
        {
            var section = new Section() { Name = name, FacilityId = facilityId };
            _sections.Add(section);
            await _sections.SaveChangesAsync();
            return Created($"/sections/{section.Id}", _converter.ConvertToClientDto(section));
        }

        [HttpGet("{id}")]
        [Authorize(Roles = $"{UserRoles.USER},{UserRoles.ADMIN}")]
        public async Task<IActionResult> GetSection([FromRoute] int id)
        {
            var section = await _sections.GetAsync(id);
            if (section is null)
            {
                return BadRequest("Section is not exist");
            }
            return Ok(section);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = $"{UserRoles.USER},{UserRoles.ADMIN}")]
        public async Task<IActionResult> DeleteSection([FromRoute] int id)
        {
            var section = await _sections.GetWithSensorsAsync(id);
            if (section is null)
            {
                return BadRequest("Section is not exist");
            }
            section.Sensors.ForEach(s => s.IsActive = false);
            _sections.Delete(section);
            await _sections.SaveChangesAsync();
            return Ok(section);
        }

        [HttpPut("change-meta")]
        [Authorize(Roles = $"{UserRoles.ADMIN}")]
        public async Task<IActionResult> ChangeSectionMeta([FromBody] SectionMetadataFromClientDto metadata)
        {
            var section = await _sections.GetAsync(metadata.Id);
            if (section is null)
            {
                return BadRequest("section is not exist");
            }

            section.Name = metadata.Name;
            await _sections.SaveChangesAsync();
            return Ok(_converter.ConvertToMetadata(section));
        }
    }
}
