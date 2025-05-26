using System.Security.Claims;

namespace FarmProject.auth.claims
{
    public class UserIdClaim(int userId) : Claim(ClaimTypes.NameIdentifier, userId.ToString())
    {
    }
}
