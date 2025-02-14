using System.Security.Claims;

namespace FarmProject.auth.claims
{
    public class UserKeyClaim(string key) : Claim("key", key)
    {
    }
}
