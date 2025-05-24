using HealthCardApi.Data;
using HealthCardApi.Models;
using Microsoft.EntityFrameworkCore;
using myApi.Data;
using myApi.Models;
using NLog;
using OtpNet;
using System.Net;
using System.Net.Mail;
using static System.Net.WebRequestMethods;

namespace myApi.Repository
{

    public class myApiRepository : ImyApiRepository
    {
        private readonly myApiDbContext _context;
        private static readonly Logger _logger = LogManager.GetCurrentClassLogger();

        public myApiRepository(myApiDbContext context)
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

        public async Task<List<HistoryDTO>> GetHistory(int UserID)
        {
            var history = await _context.HistoryInfo.Where(i => i.UserId == UserID).Select(i => new HistoryDTO()
            {
                HistoryId = i.HistoryId,
                UserId = i.UserId,
                DoctorId = i.DoctorId,
                DoctorName = i.DoctorName,
                Recorded = i.Recorded,
                ImageSrc = i.ImageSrc
            }).ToListAsync();

            return history;
        }

        public async Task<UserDTO?> SaveUser(List<string> userData)
        {
            User? newUser = new User();
            if (userData.Count > 9)
            {
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
                    await _context.SaveChangesAsync();
                }
            }
            else
            {
                newUser = new User()
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

                await _context.UserInfo.AddAsync(newUser);
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

        public async Task <UserDTO?> AuthenticateUser(LoginObject userData)
        {
            UserDTO? user = await _context.UserInfo.Where(i => i.UserName == userData.Name && i.UserPassword == userData.Password).Select(i => new UserDTO
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

            if (user?.Type == 0)
            {
                user.History = _context.HistoryInfo.Where(i => i.UserId == user.Id).Select(i => new HistoryDTO
                {
                    HistoryId = i.HistoryId,
                    UserId = i.UserId,
                    UserName = user.LastName + " " + user.FirstName,
                    DoctorId = i.DoctorId,
                    DoctorName = i.DoctorName,
                    Recorded = i.Recorded,
                    ImageSrc = i.ImageSrc
                }).ToList();
            }
              

            return user;
        }

        public bool SendOTP (int userId)
        { 
            // send email
            try
            {
                string? recip =  _context.UserInfo.Where(u => u.Id == userId).Select(u => u.Email).FirstOrDefault();
                string? OTPCode = _context.OTPMapping.Where(u => u.UserId == userId).Select(u => u.OTPCode).FirstOrDefault();

                if (string.IsNullOrWhiteSpace(recip) || string.IsNullOrWhiteSpace(OTPCode))
                    return false;

                MailMessage msg = new MailMessage();
                msg.Subject = "e-health: OTP Code";
                msg.Body = string.Format("OTP Code: {0}", OTPCode);
                msg.From = new MailAddress("dimitris-147-@hotmail.com"); 
                List<string> recipients = new List<string>();
                recipients.Add(recip);
                //recipients.Add("siountrisd@gmail.com");
                foreach(string recipient in recipients)
                {
                    msg.To.Add(recipient);
                }
        

                SmtpClient smtpClient = new SmtpClient();
                smtpClient.Host = "smtp-relay.sendinblue.com";
                smtpClient.Port = 587;
                smtpClient.UseDefaultCredentials = false;
                smtpClient.Credentials = new NetworkCredential("siountrisd@gmail.com", "BVcM7qjvkdSh5bUt");
                smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
                smtpClient.EnableSsl = true;

                smtpClient.Send(msg);
               
                return true;
            }
            catch (Exception ex)
            {
                _logger.Debug("Error:{0}", ex);
                return false;
            }

        }

        public bool AuthenticateOTP(int userId, string OTPcode)
        {
            byte[] secretKey = Base32Encoding.ToBytes("DimSiou14");

            var totp = new Totp(secretKey);

             totp.VerifyTotp(OTPcode, out _);

            var isValid = _context.OTPMapping.Any(i => i.UserId == userId && i.OTPCode == OTPcode);

            return isValid;
        }

        public async Task<HistoryDTO?> AddHistory(HistoryDTO data)
        {
            History newHistory = new History();

            newHistory.DoctorId = data.DoctorId;
            newHistory.DoctorName = data.DoctorName;
            newHistory.UserId = data.UserId;
            newHistory.Recorded = DateTime.Now;
            newHistory.ImageSrc = data.ImageSrc;

            await _context.HistoryInfo.AddAsync(newHistory);
            await _context.SaveChangesAsync();

            int id = newHistory.HistoryId;

            HistoryDTO? history = await _context.HistoryInfo.Where(h => h.HistoryId == id).Select(h => new HistoryDTO
            {
                HistoryId = id,
                DoctorId = h.DoctorId,
                DoctorName = h.DoctorName,
                UserId = h.UserId,
                Recorded= h.Recorded,
                ImageSrc= h.ImageSrc
            }).FirstOrDefaultAsync();

            return history;
        }

        public bool CreateOTP(int userId)
        {
            try
            {
                byte[] secretKey = Base32Encoding.ToBytes("DimSiou14");

                // Set the time step to 300 seconds (5 minutes)
                var totp = new Totp(secretKey, step: 300);

                string OTPCode = totp.ComputeTotp(DateTime.UtcNow);

                OTP item = new OTP
                {
                    OTPCode = OTPCode,
                    UserId = userId,
                    CreationDate = DateTime.UtcNow
                };

                //1. Remove previous
                var previous = _context.OTPMapping.Where(o => o.UserId == userId).ToList();
                foreach(var p in previous)
                {
                    _context.OTPMapping.Remove(p);
                }
                //2. Create new 
                _context.OTPMapping.Add(item);
                _context.SaveChanges();

                return true;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.ToString());
                return false;
            }
            
        }
    }
}