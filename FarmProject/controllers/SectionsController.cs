using FarmProject.auth;
using FarmProject.db.services.providers;
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

        [HttpPost]
        [Authorize(Roles = $"{UserRoles.ADMIN}")]
        public async Task<IActionResult> AddSection([FromBody] SectionMetadata metadata)
        {
            var section = new Section() { Metadata = metadata };
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

        [HttpGet("deepmeta")]
        [Authorize(Roles = $"{UserRoles.USER},{UserRoles.ADMIN}")]
        public async Task<IActionResult> GetSectionWithDeepMeta()
        {
            var sections = await _sections.GetAllWithDeepMetaAsync();
            return Ok(sections.Select(_converter.ConvertToDeepMetadata));
        }
    }
}
