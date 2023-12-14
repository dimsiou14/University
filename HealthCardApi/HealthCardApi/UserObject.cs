using System.Diagnostics.Contracts;

namespace myApi
{
    public class UserItem
    {
        public int Id { get; set; }

        public int Type { get; set; }

        public string Name { get; set; }

        public string Password { get; set; }

        public string AFM { get; set; }

        public string PhoneNumber { get; set; }

        public string Email { get; set; }

    }

    public class UserObject
    {
        public int Id { get; set; }

        public UserType Type { get; set; }

        public string Name { get; set; }

        public string Password { get; set; }

        public string AFM { get; set; }

        public string PhoneNumber { get; set; }

        public string Email { get; set; }

    }

    public class LoginObject
    {
        public string Name { get; set; }
        public string Password { get; set; }
    }

    public enum UserType
    {
        Patient = 1,
        Doctor = 0
    }

    public class HistoryObject
    {
        public int HistoryId { get; set; }

        public int UserId { get; set; }

        public int DoctorId { get; set; }

        public DateTime Recorded { get; set; }

        public string ImageSrc { get; set; }
    }
}