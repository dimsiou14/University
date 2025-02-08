namespace myApi.Models
{

    public class UserDTO
    {
        public int Id { get; set; }

        public int Type { get; set; }

        public string? Name { get; set; }

        public string? Password { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }

        public string? AFM { get; set; }

        public string? PhoneNumber { get; set; }

        public string? Email { get; set; }

        public bool HasOTP { get; set; }

        public List<HistoryDTO> History { get; set; } = new List<HistoryDTO>();

    }
}