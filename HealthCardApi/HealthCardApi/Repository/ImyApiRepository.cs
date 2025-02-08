using HealthCardApi.Models;
using myApi.Models;

namespace myApi.Repository
{

    public interface ImyApiRepository
    {
        Task<List<UserDTO>> GetAllUsers();

        Task<UserDTO?> GetUserInfo(int UserID);

        Task<List<UserDTO>> GetDoctorUsers(int DoctorID);

        Task<List<HistoryDTO>> GetHistory(int UserID);

        Task<UserDTO?> SaveUser(List<string> userData);
        Task<UserDTO?> AuthenticateUser(LoginObject userData);
        bool SendOTP(int userId);
        bool AuthenticateOTP(int userId, string OTPcode);
        Task<HistoryDTO?> AddHistory(HistoryDTO data);
        bool CreateOTP(int userId);
    }
}