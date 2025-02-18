using System.Security.Claims;

namespace FarmProject.auth.claims;

public class AdminRoleClaim() : Claim(ClaimTypes.Role, UserRoles.ADMIN)
{
}