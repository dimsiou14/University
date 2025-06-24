using Microsoft.EntityFrameworkCore;
using myApi.Data;
using myApi.Models;
using NLog;
using System.Text.Json;

namespace HealthCardApi.Services
{
    public class UserService : IUserService
    {
        private readonly HealthCardDbContext _context;
        private static readonly Logger _logger = LogManager.GetCurrentClassLogger();
        public UserService(HealthCardDbContext context)
        {
            _context = context;
        }

        public async Task<List<UserDTO>> GetAllUsers()
        {
            var users = await _context.UserInfo.Select(i => new UserDTO()
            {
                Id = i.Id,
                Type = i.UserType,
                Name = i.UserName,
                Password = i.UserPassword,
                FirstName = i.FirstName,
                LastName = i.LastName,
                AFM = i.AFM,
                PhoneNumber = i.PhoneNumber,
                Email = i.Email,
                HasOTP = i.HasOTP
            }).ToListAsync();

            return users;
        }
        public async Task<UserDTO?> GetUserInfo(int UserID)
        {
            UserDTO? info = await _context.UserInfo.Where(i => i.Id == UserID).Select(i => new UserDTO()
            {
                Id = i.Id,
                Type = i.UserType,
                Name = i.UserName,
                Password = i.UserPassword,
                FirstName = i.FirstName,
                LastName = i.LastName,
                AFM = i.AFM,
                PhoneNumber = i.PhoneNumber,
                Email = i.Email,
                HasOTP = i.HasOTP,

            }).FirstOrDefaultAsync();

            if (info != null)
            {
                info.History = await _context.HistoryInfo.Where(k => k.UserId == UserID).Select(k => new HistoryDTO
                {
                    HistoryId = k.HistoryId,
                    UserId = k.UserId,
                    UserName = info.LastName + " " + info.FirstName,
                    DoctorId = k.DoctorId,
                    DoctorName = k.DoctorName,
                    Recorded = k.Recorded,
                    ImageSrc = k.ImageSrc
                }).ToListAsync();
            }



            return info;
        }
        public async Task<List<UserDTO>> GetDoctorUsers(int DoctorID)
        {
            var doctorHistory = await _context.HistoryInfo.Where(i => i.DoctorId == DoctorID).ToListAsync();

            if (doctorHistory == null)
            {
                _logger.Debug($"Doctor history is empty for doctor id = {DoctorID}");
                return new List<UserDTO>();
            }
                

            var userIDs = doctorHistory.Select(i => i.UserId).Distinct().ToList();

            var doctorUsers = await _context.UserInfo.Where(i => userIDs.Contains(i.Id)).Select(i => new UserDTO()
            {
                Id = i.Id,
                Type = i.UserType,
                Name = i.UserName,
                Password = i.UserPassword,
                FirstName = i.FirstName,
                LastName = i.LastName,
                AFM = i.AFM,
                PhoneNumber = i.PhoneNumber,
                Email = i.Email,
                HasOTP = i.HasOTP
            }).ToListAsync();

            foreach (var doctorUser in doctorUsers)
            {
                doctorUser.History = doctorHistory.Where(i => i.UserId == doctorUser.Id).Select(i => new HistoryDTO
                {
                    HistoryId = i.HistoryId,
                    UserId = i.UserId,
                    UserName = doctorUser.LastName + " " + doctorUser.FirstName,
                    DoctorId = i.DoctorId,
                    DoctorName = i.DoctorName,
                    Recorded = i.Recorded,
                    ImageSrc = i.ImageSrc
                }).ToList();
            }

            return doctorUsers;
        }
        public async Task<UserDTO?> SaveUser(List<string> userData)
        {
            User? newUser = new User()
            {

                UserType = Convert.ToInt32(userData[8]),
                UserName = userData[0],
                UserPassword = userData[1],
                FirstName = userData[2],
                LastName = userData[3],
                Email = userData[4],
                PhoneNumber = userData[5],
                AFM = userData[6],
                HasOTP = bool.Parse(userData[7]) // userData[7] == "on" ? true : false
            };

            _logger.Debug($"Try to add user : {JsonSerializer.Serialize(newUser)}");

            await _context.UserInfo.AddAsync(newUser);
            await _context.SaveChangesAsync();


            int userID = newUser?.Id ?? 0;

            var user = await _context.UserInfo.Where(i => i.Id == userID).Select(i => new UserDTO
            {
                Id = i.Id,
                Type = i.UserType,
                Name = i.UserName,
                Password = i.UserPassword,
                FirstName = i.FirstName,
                LastName = i.LastName,
                Email = i.Email,
                PhoneNumber = i.PhoneNumber,
                AFM = i.AFM,
                HasOTP = i.HasOTP

            }).FirstOrDefaultAsync();

            return user;

        }
        public async Task<UserDTO?> UpdateUser(List<string> userData)
        {
            User? newUser = new User();

            int userId = Convert.ToInt32(userData[9]);
            newUser = await _context.UserInfo.Where(u => u.Id == userId).FirstOrDefaultAsync();

            if (newUser != null)
            {
                newUser.UserName = userData[0];
                newUser.UserPassword = userData[1];
                newUser.FirstName = userData[2];
                newUser.LastName = userData[3];
                newUser.Email = userData[4];
                newUser.PhoneNumber = userData[5];
                newUser.AFM = userData[6];
                newUser.HasOTP = bool.Parse(userData[7]);

                _logger.Debug($"Try to update user : {JsonSerializer.Serialize(newUser)}");

                await _context.SaveChangesAsync();
            }

            int userID = newUser?.Id ?? 0;

            var user = await _context.UserInfo.Where(i => i.Id == userID).Select(i => new UserDTO
            {
                Id = i.Id,
                Type = i.UserType,
                Name = i.UserName,
                Password = i.UserPassword,
                FirstName = i.FirstName,
                LastName = i.LastName,
                Email = i.Email,
                PhoneNumber = i.PhoneNumber,
                AFM = i.AFM,
                HasOTP = i.HasOTP

            }).FirstOrDefaultAsync();

            return user;

        }
    }
}
