using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using FarmProject.auth.claims;
using FarmProject.db.services.providers;
using FarmProject.dto.groups.services;
using FarmProject.dto.users;
using FarmProject.dto.users.services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace FarmProject.auth.controllers;

[ApiController]
public class UserAuthController(IOptions<AuthenticationJwtOptions> jwtOptions, UserProvider _users) : ControllerBase
{
    private readonly AuthenticationJwtOptions _jwtOptions = jwtOptions.Value;

    [HttpPost("login")]
    public async Task<IActionResult> CreateAccessToken([FromBody] string key)
    {
        var user = await _users.GetUserByKeyAsync(key);
        if (user is null)
        {
            return Unauthorized("Invalid key");
        }

        var claims = GetUserClaim(Roles.USER, key, user.Id);
        var jwt = new JwtSecurityToken(
                issuer: AuthenticationJwtOptions.ISSUER,
                audience: AuthenticationJwtOptions.AUDIENCE,
                claims: claims,
                expires: AuthenticationJwtOptions.EXPIRES,
                signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.Key)), SecurityAlgorithms.HmacSha256)
            );
        return Ok(new { userId = user.Id, key = new JwtSecurityTokenHandler().WriteToken(jwt) });
    }

    [HttpPost("/login/admin")]
    public async Task<IActionResult> CreateAdminAccessToken([FromBody] string key)
    {
        var user = await _users.GetAdminByKeyAsync(key);
        if (user is null)
        {
            return Unauthorized();
        }
        var claims = GetUserClaim(Roles.ADMIN, key, user.Id);
        var jwt = new JwtSecurityToken(
                issuer: AuthenticationJwtOptions.ISSUER,
                audience: AuthenticationJwtOptions.AUDIENCE,
                claims: claims,
                expires: AuthenticationJwtOptions.EXPIRES,
                signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.Key)), SecurityAlgorithms.HmacSha256)
            );
        return Ok(new { userId = user.Id, key = new JwtSecurityTokenHandler().WriteToken(jwt) });
    }
    [HttpGet("admin/users")]
    [Authorize(Roles = UserRoles.ADMIN)]
    public async Task<IActionResult> GetUsers([FromServices] UserDtoConverter converter)
    {
        var userList = await _users.GetUsersAsync();
        return Ok(userList.Select(converter.ConvertToAdminClientDto));
    }

    [HttpGet("user/facility/{id}")]
    [Authorize(Roles = $"{UserRoles.USER},{UserRoles.ADMIN}")]
    public async Task<IActionResult> GetUserFacility([FromRoute] int id, [FromServices] UserAccessService accessService,
        [FromServices] FacilityConverter converter, [FromServices] FacilityProvider facilities)
    {
        var user = await _users.GetUserByIdAsync(int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!));
        if (user is null) return BadRequest();
        if (User.FindFirstValue(ClaimTypes.Role) == UserRoles.USER &&
            !await accessService.CheckFacilityAffiliation(user.Id, id)) return Forbid();
        var facility = await facilities.GetAsync(id);
        if (facility is null) return BadRequest();
        return Ok(converter.ConvertToClientMeta(facility));
    }

    [HttpPut("users")]
    [Authorize(Roles = UserRoles.ADMIN)]
    public async Task<IActionResult> UpdateUser([FromBody] UserFromAdminClientDto userData, [FromServices] UserDtoConverter converter)
    {
        var user = await _users.GetByIdAsync(userData.Id);
        if (user is null)
        {
            return BadRequest("Invalid key");
        }

        converter.ConvertFromAdminClientDto(userData, user);
        await _users.SaveChangesAsync();
        return Ok(converter.ConvertToAdminClientDto(user));
    }
    [HttpPost("users")]
    [Authorize(Roles = UserRoles.ADMIN)]
    public async Task<IActionResult> CreateUser([FromBody] UserFromAdminClientDto userData, [FromServices] UserDtoConverter converter)
    {
        var user = await _users.GetByKeyAsync(userData.Key);
        if (user is not null)
        {
            return BadRequest("User already exist");
        }

        user = converter.ConvertFromAdminClientDto(userData);
        await _users.AddAsync(user);
        await _users.SaveChangesAsync();
        return Created("admin/users", converter.ConvertToAdminClientDto(user));
    }
    [HttpDelete("users")]
    [Authorize(Roles = UserRoles.ADMIN)]
    public async Task<IActionResult> DeleteUser([FromBody] int id)
    {
        var user = await _users.GetByIdAsync(id);
        if (user is null)
        {
            return Ok();
        }
        _users.Delete(user);
        await _users.SaveChangesAsync();
        return Ok(user);
    }

    private static List<Claim> GetUserClaim(Roles role, string key, int userId)
    {
        switch (role)
        {
            case Roles.ADMIN:
                {
                    return new List<Claim> { new UserKeyClaim(key), new AdminRoleClaim(), new UserIdClaim(userId) };
                }
            case Roles.USER:
                {
                    return new List<Claim> { new UserKeyClaim(key), new UserRoleClaim(), new UserIdClaim(userId) };
                }
            default:
                {
                    throw new ArgumentException();
                }
        }
    }

    private enum Roles
    {
        ADMIN,
        USER
    }
}
