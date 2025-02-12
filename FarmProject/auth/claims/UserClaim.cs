using System.Security.Claims;

namespace FarmProject.auth.claims
{
    public class UserClaim(string key) : Claim("key", key)
    {
    }
}
