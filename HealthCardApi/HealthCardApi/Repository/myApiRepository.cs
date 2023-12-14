using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using myApi.Models;
using myApi.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mail;
using MailKit.Security;
using MimeKit.Text;
using MimeKit;
using System.Security.Cryptography;
using System.Net;
using static System.Net.Mime.MediaTypeNames;
using NLog;

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

        public async Task<List<UserModel>> GetAllUsers()
        {
            var users = await _context.UserInfo.Select(i => new UserModel()
            {
                Id = i.Id,
                Type = i.UserType,
                Name = i.UserName,
                Password = i.UserPassword,
                AFM = i.AFM,
                PhoneNumber = i.PhoneNumber,
                Email = i.Email,
                HasOTP = i.HasOTP
            }).ToListAsync();

            return users;
        }

        public async Task<List<UserModel>> GetUserInfo(int UserID)
        {
            var info = await _context.UserInfo.Where(i => i.Id == UserID).Select(i => new UserModel()
            {
                Id = i.Id,
                Type = i.UserType,
                Name = i.UserName,
                Password = i.UserPassword,
                AFM = i.AFM,
                PhoneNumber = i.PhoneNumber,
                Email = i.Email,
                HasOTP = i.HasOTP
            }).ToListAsync();

            return info;
        }

        public async Task<List<UserModel>> GetDoctorUsers(int DoctorID)
        {
            var userIDs = await _context.HistoryInfo.Where(i => i.DoctorId == DoctorID).Select(i => i.UserId).ToListAsync();

            var doctorUsers = await _context.UserInfo.Where(i => userIDs.Contains(i.Id)).Select(i => new UserModel()
            {
                Id = i.Id,
                Type = i.UserType,
                Name = i.UserName,
                Password = i.UserPassword,
                AFM = i.AFM,
                PhoneNumber = i.PhoneNumber,
                Email = i.Email,
                HasOTP = i.HasOTP
            }).ToListAsync();

            return doctorUsers;
        }

        public async Task<List<HistoryModel>> GetHistory(int UserID)
        {
            var history = await _context.HistoryInfo.Where(i => i.UserId == UserID).Select(i => new HistoryModel()
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

        public async Task<UserModel> SaveUser(List<string> userData)
        {
         
            User newUser = new User()
            {
           
                UserType = (int)UserType.Patient,
                UserName = userData[0],
                UserPassword = userData[1],
                Email = userData[4],
                PhoneNumber = userData[5],
                AFM = userData[6],
                HasOTP = bool .Parse(userData[7])
            };

            await _context.UserInfo.AddAsync(newUser);
            await _context.SaveChangesAsync();

            var user = await _context.UserInfo.Where(i => i.Id == 1).Select(i => new UserModel
            {
                Id = i.Id,
                Type = i.UserType,
                Name = i.UserName,
                Password = i.UserPassword,
                Email = i.Email,
                PhoneNumber = i.PhoneNumber,
                AFM = i.AFM,
                HasOTP = i.HasOTP

            }).FirstOrDefaultAsync();

            return user;

        }

        public async Task <UserModel> AuthenticateUser(LoginObject userData)
        {
            var user = await _context.UserInfo.Where(i => i.UserName == userData.Name && i.UserPassword == userData.Password).Select(i => new UserModel
            {
                Id = i.Id,
                Type = i.UserType,
                Name = i.UserName,
                Password = i.UserPassword,
                Email = i.Email,
                PhoneNumber = i.PhoneNumber,
                AFM = i.AFM,
                HasOTP = i.HasOTP

            }).FirstOrDefaultAsync();

            return user;
        }

        public async Task <bool> SendOTP (string emailRecipient)
        {
            bool isSend = false;
            Random random = new Random();
            long OTPCode = random.Next(10000, 99999);
            /*
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse("siountrisd@gmail.com"));
            email.To.Add(MailboxAddress.Parse("dimitris-147-@hotmail.com"));
            email.Subject = "e-health: OTP Code";
            string text = string.Format("OTP Code: {0}", OTPCode);
            email.Body = new TextPart(TextFormat.Plain) { Text = text };

            MailMessage msg = new MailMessage();
            msg.Body = text;
            msg.From = new MailAddress("siountrisd@gmail.com");
            MailAddressCollection recipients = new MailAddressCollection();
            recipients.Add(new MailAddress("dimitris-147-@hotmail.com"));
            msg.To = recipients;
            */
         
            // send email
            try
            {
                MailMessage msg = new MailMessage();
                msg.Subject = "e-health: OTP Code";
                msg.Body = string.Format("OTP Code: {0}", OTPCode);
                msg.From = new MailAddress("dimitris-147-@hotmail.com"); 
                List<string> recipients = new List<string>();
                recipients.Add("siountrisd@gmail.com");
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
                
              /*  smtp.Authenticate("[USERNAME]", "[PASSWORD]");
                smtp.Send(msg);
                smtp.Dispose();
                */

                isSend = true;
                return isSend;
            }
            catch (Exception ex)
            {
                _logger.Debug("Error:{0}", ex);
                isSend = false;
                return isSend;
            }

        }
    }
}