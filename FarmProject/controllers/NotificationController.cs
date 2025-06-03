using System.Security.Claims;
using FarmProject.db.models;
using FarmProject.db.services.providers;
using FarmProject.dto.users.services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FarmProject.controllers
{
    [ApiController]
    [Route("/notifications")]
    public class NotificationController : ControllerBase
    {
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetNotifications(
            [FromServices] UserProvider users,
            [FromServices] UserDtoConverter converter,
            [FromQuery] int? limit,
            [FromQuery] int offset = 0)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId is null) return BadRequest();

            List<Notification>? notifications = null;
            int userIdInt = int.Parse(userId);

            if (limit is null)
            {
                notifications = await users.GetNotificationsAsync(userIdInt);
            }
            else
            {
                notifications = await users.GetNotificationsAsync(userIdInt, (int)limit, offset);
            }
            if (notifications is null)
            {
                return NotFound();
            }
            return Ok(notifications.Select(converter.ConvertNotification));
        }

        [HttpGet("checked/{userId}")]
        [Authorize]
        public async Task<IActionResult> GetCheckedNotifications([FromRoute] int userId,
            [FromServices] UserProvider users,
            [FromServices] UserDtoConverter converter)
        {
            var userIdFromAuth = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdFromAuth is null || int.Parse(userIdFromAuth) != userId)
            {
                return Forbid();
            }

            var notifications = await users.GetCheckedNotificationsAsync(userId);
            if (notifications is null)
            {
                return NotFound();
            }
            return Ok(notifications.Select(converter.ConvertNotification));
        }

        [HttpGet("unchecked/{userId}")]
        [Authorize]
        public async Task<IActionResult> GetUncheckedNotifications([FromRoute] int userId,
            [FromServices] UserProvider users,
            [FromServices] UserDtoConverter converter)
        {
            var userIdFromAuth = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdFromAuth is null || int.Parse(userIdFromAuth) != userId)
            {
                return Forbid();
            }

            var notifications = await users.GetUncheckedNotificationsAsync(userId);
            if (notifications is null)
            {
                return NotFound();
            }
            return Ok(notifications.Select(converter.ConvertNotification));
        }
    }
}
