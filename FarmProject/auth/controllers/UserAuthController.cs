using FarmProject.auth.claims;
using FarmProject.db.services.providers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FarmProject.auth.controllers;

[ApiController]
[Route("/login")]
public class UserAuthController(IOptions<AuthenticationJwtOptions> jwtOptions) : ControllerBase
{
    private readonly AuthenticationJwtOptions jwtOptions = jwtOptions.Value;

    [HttpPost]
    public async Task<IActionResult> CreateAccessToken([FromBody] string key, [FromServices] UserProvider users)
    {
        if (await users.GetByKey(key) is null)
        {
            return BadRequest("Invalid key");
        }

        var claims = new List<Claim> { new UserClaim(key) };
        var jwt = new JwtSecurityToken(
                issuer: AuthenticationJwtOptions.ISSUER,
                audience: AuthenticationJwtOptions.AUDIENCE,
                claims: claims,
                expires: AuthenticationJwtOptions.EXPIRES,
                signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Key)), SecurityAlgorithms.HmacSha256)
            );
        return Ok(new JwtSecurityTokenHandler().WriteToken(jwt));
    }
}
