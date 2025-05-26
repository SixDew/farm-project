using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;

namespace FarmProject.hubs.services
{
    public class NameIdentifierUserIdProvider : IUserIdProvider
    {
        public string GetUserId(HubConnectionContext connection)
        {
            return connection.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }
    }
}
