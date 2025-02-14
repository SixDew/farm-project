using System.Security.Claims;

namespace FarmProject.auth.claims;

public class UserRoleClaim() : Claim(ClaimTypes.Role, "user")
{
}
