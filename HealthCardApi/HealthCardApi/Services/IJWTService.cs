using myApi.Data;
using myApi.Models;

namespace HealthCardApi.Services
{
    public interface IJWTService
    {
        string GenerateJwtToken(UserDTO user);
    }
}
