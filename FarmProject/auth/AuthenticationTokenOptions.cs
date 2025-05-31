namespace FarmProject.auth
{
    public class AuthenticationTokenOptions
    {
        public static readonly string ISSUER = "farm-test-issuer-jwt";
        public static readonly string AUDIENCE = "farm-test-audience-jwt";
        public static DateTime REFRESH_EXPIRES
        {
            get
            {
                return DateTime.UtcNow.AddDays(7);
            }
        }
        public static DateTime EXPIRES
        {
            get
            {
                return DateTime.UtcNow.AddMinutes(1);
            }
        }
        public string Key { get; set; }
    }
}
