namespace myApi.Data
{

    public class User
    {
        public int Id { get; set; }

        public int UserType { get; set; }

        public string UserName { get; set; }

        public string UserPassword { get; set; }

        public string AFM { get; set; }

        public string PhoneNumber { get; set; }

        public string Email { get; set; }
        public bool HasOTP { get; set; }

    }
}