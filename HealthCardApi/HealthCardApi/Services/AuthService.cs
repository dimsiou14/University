using HealthCardApi.Data;
using HealthCardApi.Models;
using Microsoft.EntityFrameworkCore;
using myApi.Data;
using myApi.Models;
using NLog;
using OtpNet;
using System.Net.Mail;
using System.Net;
using System.Text.Json;

namespace HealthCardApi.Services
{
    public class AuthService : IAuthService
    {
        private readonly HealthCardDbContext _context;
        private static readonly Logger _logger = LogManager.GetCurrentClassLogger();
        public AuthService(HealthCardDbContext context)
        {
            _context = context;
        }
        public async Task<UserDTO?> AuthenticateUser(LoginObject userData)
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
        public bool CreateOTP(int userId)
        {
            try
            {
                byte[] secretKey = Base32Encoding.ToBytes("DIMSIOU27DIMSIOU27DIMSIOU27DIMSI");

                // Set the time step to 300 seconds (5 minutes)
                var totp = new Totp(secretKey, step: 300);

                string OTPCode = totp.ComputeTotp(DateTime.UtcNow);

                OTP item = new OTP
                {
                    OTPCode = OTPCode,
                    UserId = userId,
                    CreationDate = DateTime.UtcNow
                };

                //1. Remove previous if exist
                var previous = _context.OTPMapping.Where(o => o.UserId == userId).ToList();
                foreach (var p in previous)
                {
                    _context.OTPMapping.Remove(p);
                }
                //2. Create new 
                _logger.Debug($"Try to add otp : {JsonSerializer.Serialize(item)}");
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
        public bool SendOTP(int userId)
        {
            // send email
            try
            {
                string? recip = _context.UserInfo.Where(u => u.Id == userId).Select(u => u.Email).FirstOrDefault();
                string? OTPCode = _context.OTPMapping.Where(u => u.UserId == userId).Select(u => u.OTPCode).FirstOrDefault();

                if (string.IsNullOrWhiteSpace(recip) || string.IsNullOrWhiteSpace(OTPCode))
                    return false;

                MailMessage msg = new MailMessage();
                msg.Subject = "e-health: OTP Code";
                msg.Body = string.Format("OTP Code: {0}", OTPCode);
                msg.From = new MailAddress("dimitris-147-@hotmail.com");
                List<string> recipients = new List<string>();

                foreach (string recipient in recipients)
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

                _logger.Debug($"Try to send email : {JsonSerializer.Serialize(msg)}");
                smtpClient.Send(msg);

                return true;
            }
            catch (Exception ex)
            {
                _logger.Error(ex.ToString());
                return false;
            }

        }
        public bool AuthenticateOTP(int userId, string OTPcode)
        {
            var existingOTP = _context.OTPMapping.FirstOrDefault(i => i.UserId == userId && i.OTPCode == OTPcode);

            if (existingOTP == null)
                return false;

            byte[] secretKey = Base32Encoding.ToBytes("DIMSIOU27DIMSIOU27DIMSIOU27DIMSI");

            var totp = new Totp(secretKey);

            bool isValid = totp.VerifyTotp(OTPcode, out _);

            if (!isValid)
            {
                // check otp validity, otp code is valid for 5 minutes only
                DateTime now = DateTime.Now;
                TimeSpan threshold = new TimeSpan(0, 5, 0);
                _logger.Debug($"Check OTP. [CreationDate :{existingOTP.CreationDate}] [Now: {now}] [Threshold : {threshold}]");
                isValid = existingOTP.CreationDate.Add(threshold) <= now;
                _logger.Debug($"Check OTP. [Valid :{isValid}]");

            }

            return isValid;
        }

    }
}
