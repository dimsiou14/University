using HealthCardApi.Models;
using Microsoft.IdentityModel.Tokens;
using myApi.Data;
using myApi.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace HealthCardApi.Services
{
    public class JWTService : IJWTService
    {
        private readonly JWTOptions options;
        public JWTService(JWTOptions jwtOptions)
        {
            options = jwtOptions;
        }
        public string GenerateJwtToken(UserDTO user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(options.SecretKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
             new Claim(JwtRegisteredClaimNames.Sub, user.Name ?? ""),
             new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
            issuer: options.Issuer,
            audience: options.Audience,
            claims: claims,
            expires: DateTime.Now.Add(options.Expiration),
            signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);

        }
    }
}
