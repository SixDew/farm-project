using FarmProject.auth.claims;
using FarmProject.db.services.providers;
using FarmProject.dto.users;
using FarmProject.dto.users.services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FarmProject.auth.controllers;

[ApiController]
public class UserAuthController(IOptions<AuthenticationJwtOptions> jwtOptions, UserProvider users) : ControllerBase
{
    private readonly AuthenticationJwtOptions jwtOptions = jwtOptions.Value;
    private readonly UserProvider _users = users;

    [HttpPost("login")]
    public async Task<IActionResult> CreateAccessToken([FromBody] string key)
    {
        if (await _users.GetUserByKey(key) is null)
        {
            return Unauthorized("Invalid key");
        }

        var claims = new List<Claim> { new UserKeyClaim(key), new UserRoleClaim() };
        var jwt = new JwtSecurityToken(
                issuer: AuthenticationJwtOptions.ISSUER,
                audience: AuthenticationJwtOptions.AUDIENCE,
                claims: claims,
                expires: AuthenticationJwtOptions.EXPIRES,
                signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Key)), SecurityAlgorithms.HmacSha256)
            );
        return Ok(new JwtSecurityTokenHandler().WriteToken(jwt));
    }

    [HttpPost("/login/admin")]
    public async Task<IActionResult> CreateAdminAccessToken([FromBody] string key)
    {
        if (await _users.GetAdminByKey(key) is null)
        {
            return Unauthorized();
        }
        var claims = new List<Claim> { new UserKeyClaim(key), new AdminRoleClaim() };
        var jwt = new JwtSecurityToken(
                issuer: AuthenticationJwtOptions.ISSUER,
                audience: AuthenticationJwtOptions.AUDIENCE,
                claims: claims,
                expires: AuthenticationJwtOptions.EXPIRES,
                signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Key)), SecurityAlgorithms.HmacSha256)
            );
        return Ok(new JwtSecurityTokenHandler().WriteToken(jwt));
    }
    [HttpGet("admin/users")]
    [Authorize(Roles = UserRoles.ADMIN)]
    public async Task<IActionResult> GetUsers([FromServices] UserDtoConverter converter)
    {
        var userList = await users.GetUsers();
        return Ok(userList.Select(converter.ConvertToAdminClientDto));
    }
    [HttpPut("users")]
    [Authorize(Roles = UserRoles.ADMIN)]
    public async Task<IActionResult> UpdateUser([FromBody] UserFromAdminClientDto userData, [FromServices] UserDtoConverter converter)
    {
        var user = await users.GetByKey(userData.Key);
        if (user is null)
        {
            return BadRequest("Invalid key");
        }

        converter.ConvertFromAdminClientDto(userData, user);
        await users.SaveChangesAsync();
        return Ok(converter.ConvertToAdminClientDto(user));
    }
    [HttpPost("users")]
    [Authorize(Roles = UserRoles.ADMIN)]
    public async Task<IActionResult> CreateUser([FromBody] UserFromAdminClientDto userData, [FromServices] UserDtoConverter converter)
    {
        var user = await users.GetByKey(userData.Key);
        if (user is not null)
        {
            return BadRequest("User already exist");
        }

        user = converter.ConvertFromAdminClientDto(userData);
        await users.AddAsync(user);
        await users.SaveChangesAsync();
        return Created("admin/users", converter.ConvertToAdminClientDto(user));
    }
    [HttpDelete("users")]
    [Authorize(Roles = UserRoles.ADMIN)]
    public async Task<IActionResult> DeleteUser([FromBody] string key, [FromServices] UserProvider users)
    {
        var user = await users.GetByKey(key);
        if (user is null)
        {
            return Ok();
        }
        users.Delete(user);
        await users.SaveChangesAsync();
        return Ok(user);
    }
}
