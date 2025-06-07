namespace HealthCardApi.Models
{
    public class JWTOptions
    {
        public JWTOptions()
        {
                
        }
        public JWTOptions(string issuer, string audience, string secretkey, TimeSpan expiration)
        {
            Issuer = issuer;
            Audience = audience;
            SecretKey = secretkey;
            Expiration = expiration;
                    
        }
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public string SecretKey { get; set; }
        public TimeSpan Expiration { get; set; }

    }
}
