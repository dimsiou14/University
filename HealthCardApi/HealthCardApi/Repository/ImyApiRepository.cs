using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using myApi.Models;
using myApi.Data;

namespace myApi.Repository
{

    public interface ImyApiRepository
    {
        Task<List<UserModel>> GetAllUsers();

        Task<UserModel> GetUserInfo(int UserID);

        Task<List<UserModel>> GetDoctorUsers(int DoctorID);

        Task<List<HistoryModel>> GetHistory(int UserID);

        Task<UserModel> SaveUser(List<string> userData);
        Task<UserModel> AuthenticateUser(LoginObject userData);
        Task<bool> SendOTP(int userId);
        bool AuthenticateOTP(int userId, string OTPcode);
        Task<HistoryModel> AddHistory(HistoryObject data);
        Task<bool> CreateOTP(int userId);
    }
}