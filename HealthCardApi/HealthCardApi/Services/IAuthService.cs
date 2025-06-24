using HealthCardApi.Models;
using myApi.Models;

namespace HealthCardApi.Services
{
    public interface IAuthService
    {
        Task<UserDTO?> AuthenticateUser(LoginObject userData);
        bool AuthenticateOTP(int userId, string OTPcode);
        bool CreateOTP(int userId);
        bool SendOTP(int userId);

    }
}
