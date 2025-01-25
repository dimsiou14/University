using myApi.Models;

namespace myApi.Repository
{

    public interface ImyApiRepository
    {
        Task<List<UserModel>> GetAllUsers();

        Task<UserModel?> GetUserInfo(int UserID);

        Task<List<UserModel>> GetDoctorUsers(int DoctorID);

        Task<List<HistoryModel>> GetHistory(int UserID);

        Task<UserModel?> SaveUser(List<string> userData);
        Task<UserModel?> AuthenticateUser(LoginObject userData);
        bool SendOTP(int userId);
        bool AuthenticateOTP(int userId, string OTPcode);
        Task<HistoryModel?> AddHistory(HistoryObject data);
        bool CreateOTP(int userId);
    }
}