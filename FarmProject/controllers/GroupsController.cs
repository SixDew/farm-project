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

        [HttpGet("meta")]
        [Authorize(Roles = $"{UserRoles.USER},{UserRoles.ADMIN}")]
        public async Task<IActionResult> GetGroupsMetadata()
        {
            var groups = await _groups.GetAllOnlyMetadataAsync();
            return Ok(groups.Select(_converter.ConvertToMetadata));
        }

        [HttpGet("sensor/{imei}")]
        [Authorize(Roles = $"{UserRoles.USER},{UserRoles.ADMIN}")]
        public async Task<IActionResult> GetSensorGroupsMetadata([FromRoute] string imei)
        {
            var groups = await _sensorProvider.GetGroupsAsync(imei);
            if (groups is null)
            {
                return BadRequest("Sensor is not exist");
            }
            return Ok(groups.Select(_converter.ConvertToMetadata));
        }

        [HttpPost("remove/{id}")]
        [Authorize(Roles = $"{UserRoles.ADMIN}")]
        public async Task<IActionResult> RemoveFromGroup([FromBody] string sensorImei, [FromRoute] int id)
        {
            var groups = await _sensorProvider.GetGroupsAsync(sensorImei);

            if (groups is null)
            {
                return BadRequest();
            }
            var group = groups.Find(g => g.Id == id);
            if (group is null)
            {
                return Ok();
            }

            groups.Remove(group);
            await _sensorProvider.SaveChangesAsync();
            return Ok();
        }
    }
}
