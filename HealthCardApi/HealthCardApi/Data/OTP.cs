namespace HealthCardApi.Data
{
    public class OTP
    { 
        public int Id {get;set;}
        public int UserId { get; set; }
        public string? OTPCode { get; set; }
    }
}
