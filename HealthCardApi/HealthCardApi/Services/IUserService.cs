using myApi.Models;

namespace HealthCardApi.Services
{
    public interface IUserService
    {
        Task<List<UserDTO>> GetAllUsers();
        Task<UserDTO?> GetUserInfo(int UserID);
        Task<List<UserDTO>> GetDoctorUsers(int DoctorID);
        Task<UserDTO?> SaveUser(List<string> userData);
        Task<UserDTO?> UpdateUser(List<string> userData);
    }
}
