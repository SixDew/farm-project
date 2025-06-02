using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using FarmProject.auth.claims;
using FarmProject.db.models;
using FarmProject.db.services.providers;
using FarmProject.dto.groups.services;
using FarmProject.dto.users;
using FarmProject.dto.users.services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace FarmProject.auth.controllers;

[ApiController]
public class UserAuthController(IOptions<AuthenticationTokenOptions> jwtOptions, UserProvider _users,
    IPasswordHasher<User> _passwordHasher) : ControllerBase
{
    private readonly AuthenticationTokenOptions _jwtOptions = jwtOptions.Value;

    [HttpPost("login")]
    public async Task<IActionResult> CreateAccessToken([FromBody] LoginDto loginData)
    {
        var user = await _users.GetUserByLoginAsync(loginData.Login);
        if (user is null) return BadRequest("User is not exist");
        if (_passwordHasher.VerifyHashedPassword(user, user.Key, loginData.Password) != PasswordVerificationResult.Success)
        {
            return BadRequest("Password is invalid");
        }

        var claims = GetUserClaim(Roles.USER, loginData.Password, user.Id);
        var jwt = new JwtSecurityToken(
                issuer: AuthenticationTokenOptions.ISSUER,
                audience: AuthenticationTokenOptions.AUDIENCE,
                claims: claims,
                expires: AuthenticationTokenOptions.EXPIRES,
                signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.Key)), SecurityAlgorithms.HmacSha256)
            );
        var refreshToken = await SetRefreshToken(user);
        CookiesSetRefreshToken(refreshToken);
        return Ok(new { role = user.Role, key = new JwtSecurityTokenHandler().WriteToken(jwt) });
    }

    [HttpPost("/login/admin")]
    public async Task<IActionResult> CreateAdminAccessToken([FromBody] LoginDto loginData)
    {
        var user = await _users.GetAdminByLoginAsync(loginData.Login);
        if (user is null) return BadRequest("User is not exist");
        if (_passwordHasher.VerifyHashedPassword(user, user.Key, loginData.Password) != PasswordVerificationResult.Success)
        {
            return BadRequest("Password is invalid");
        }

        var claims = GetUserClaim(Roles.ADMIN, loginData.Password, user.Id);
        var jwt = new JwtSecurityToken(
                issuer: AuthenticationTokenOptions.ISSUER,
                audience: AuthenticationTokenOptions.AUDIENCE,
                claims: claims,
                expires: AuthenticationTokenOptions.EXPIRES,
                signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.Key)), SecurityAlgorithms.HmacSha256)
            );

        var refreshToken = await SetRefreshToken(user);
        CookiesSetRefreshToken(refreshToken);
        return Ok(new { role = user.Role, key = new JwtSecurityTokenHandler().WriteToken(jwt) });
    }

    [HttpPost("login/refresh")]
    public async Task<IActionResult> RefreshToken()
    {
        if (Request.Cookies.TryGetValue("refreshToken", out var refreshTokenStr))
        {
            var user = await _users.GetByTokenAsync(Guid.Parse(refreshTokenStr));
            if (user is null || user.RefreshToken is null || refreshTokenStr != user.RefreshToken.Token.ToString()
                || DateTime.UtcNow > user.RefreshToken.Expires) return Unauthorized();

            var claims = user.Role switch
            {
                UserRoles.ADMIN => GetUserClaim(Roles.ADMIN, user.Key, user.Id),
                _ => GetUserClaim(Roles.USER, user.Key, user.Id)
            };
            var jwt = new JwtSecurityToken(
                    issuer: AuthenticationTokenOptions.ISSUER,
                    audience: AuthenticationTokenOptions.AUDIENCE,
                    claims: claims,
                    expires: AuthenticationTokenOptions.EXPIRES,
                    signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.Key)), SecurityAlgorithms.HmacSha256)
                );

            var newRefreshToken = await SetRefreshToken(user);
            CookiesSetRefreshToken(newRefreshToken);

            return Ok(new { role = user.Role, key = new JwtSecurityTokenHandler().WriteToken(jwt) });
        }
        else return Unauthorized();
    }
    [HttpDelete("login/refresh")]
    [Authorize(Roles = $"{UserRoles.USER},{UserRoles.ADMIN}")]
    public async Task<IActionResult> RemoveRefresh([FromServices] RefreshTokensProvider _tokens)
    {
        var user = await _users.GetByIdAsync(int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)));
        if (user is null) return BadRequest();

        if (user.RefreshToken is not null)
        {
            _tokens.Delete(user.RefreshToken);
            await _tokens.SaveChangesAsync();
        }
        return Ok();
    }

    [HttpGet("admin/users")]
    [Authorize(Roles = UserRoles.ADMIN)]
    public async Task<IActionResult> GetUsers([FromServices] UserDtoConverter converter)
    {
        var userList = await _users.GetUsersAsync();
        return Ok(userList.Select(converter.ConvertToAdminClientDto));
    }

    [HttpGet("user/facility")]
    [Authorize(Roles = $"{UserRoles.USER},{UserRoles.ADMIN}")]
    public async Task<IActionResult> GetUserFacility([FromServices] UserAccessService accessService,
        [FromServices] FacilityConverter converter, [FromServices] FacilityProvider facilities)
    {
        var user = await _users.GetUserByIdAsync(int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!));
        if (user is null) return BadRequest();
        var facility = await facilities.GetAsync(user.FacilityId);
        if (facility is null) return BadRequest();
        return Ok(converter.ConvertToClientMeta(facility));
    }

    [HttpPut("users")]
    [Authorize(Roles = UserRoles.ADMIN)]
    public async Task<IActionResult> UpdateUser([FromBody] UserFromAdminClientDto userData, [FromServices] UserDtoConverter converter)
    {
        var user = await _users.GetByIdAsync(userData.Id);
        if (user is null) return BadRequest("Invalid id");
        converter.ConvertFromAdminClientDto(userData, user);
        try
        {
            await _users.SaveChangesAsync();
        }
        catch (Exception ex) { return BadRequest("Login не уникальный"); }
        return Ok(converter.ConvertToAdminClientDto(user));
    }
    [HttpPost("users")]
    [Authorize(Roles = UserRoles.ADMIN)]
    public async Task<IActionResult> CreateUser([FromBody] UserFromAdminClientDto userData, [FromServices] UserDtoConverter converter)
    {
        var user = await _users.GetByLoginAsync(userData.Login);
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
        if (user is null) return Ok();
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

    private void CookiesSetRefreshToken(RefreshToken token)
    {
        Response.Cookies.Append("refreshToken", token.Token.ToString(), new CookieOptions()
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = token.Expires
        });
    }

    private async Task<RefreshToken> SetRefreshToken(int userId)
    {
        var user = await _users.GetAsync(userId);
        if (user is null)
        {
            throw new InvalidOperationException();
        }

        user.RefreshToken = new RefreshToken() { Expires = AuthenticationTokenOptions.REFRESH_EXPIRES };
        await _users.SaveChangesAsync();
        return user.RefreshToken;
    }

    private async Task<RefreshToken> SetRefreshToken(User user)
    {
        var newRefreshToken = new RefreshToken() { Expires = AuthenticationTokenOptions.REFRESH_EXPIRES };
        if (user.RefreshToken is null) user.RefreshToken = newRefreshToken;
        else
        {
            user.RefreshToken.Token = newRefreshToken.Token;
            user.RefreshToken.Expires = newRefreshToken.Expires;
        }
        await _users.SaveChangesAsync();
        return user.RefreshToken;
    }

    private enum Roles
    {
        ADMIN,
        USER
    }
}
