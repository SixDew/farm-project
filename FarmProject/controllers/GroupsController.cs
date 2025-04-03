using FarmProject.auth;
using FarmProject.db.services.providers;
using FarmProject.dto.groups.services;
using FarmProject.group_feature.group;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace FarmProject.controllers
{
    [ApiController]
    [Route("/groups")]
    public class GroupsController(PressureSensorProvider _sensorProvider, SensorGroupsProvider _groups, GroupConverter _converter) : ControllerBase
    {
        [HttpGet()]
        [Authorize(Roles = $"{UserRoles.USER},{UserRoles.ADMIN}")]
        public async Task<IActionResult> GetGroups()
        {
            var groupList = await _groups.GetAllAsync();
            return Ok(groupList.Select(_converter.ConvertToClient));
        }

        [HttpPost("{sectionId}")]
        [Authorize(Roles = $"{UserRoles.ADMIN}")]
        public async Task<IActionResult> AddGroup([FromBody] GroupMetadata metadata, [FromRoute] int sectionId)
        {
            SensorGroup group = new SensorGroup() { Metadata = metadata, SectionId = sectionId };
            await _groups.AddAsync(group);
            await _groups.SaveChangesAsync();
            return Created($"/group/{group.Id}", _converter.ConvertToClient(group));
        }

        [HttpPost("add/{id}")]
        [Authorize(Roles = $"{UserRoles.ADMIN}")]
        public async Task<IActionResult> AddToGroup([FromBody] string sensorImei, [FromRoute] int id)
        {
            var group = await _groups.GetAsync(id);
            var sensor = await _sensorProvider.GetByImeiAsync(sensorImei);
            if (sensor is null || group is null)
            {
                return BadRequest();
            }
            group.Sensors.Add(sensor);
            await _groups.SaveChangesAsync();
            return Ok();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = $"{UserRoles.USER},{UserRoles.ADMIN}")]
        public async Task<IActionResult> GetGroup([FromRoute] int id)
        {
            var group = await _groups.GetAsync(id);
            if (group is null)
            {
                return BadRequest("Group is not exitst");
            }
            return Ok(_converter.ConvertToClient(group));
        }
    }
}
