using DewLib.db;

namespace FarmProject.db.models
{
    public class RefreshToken : BaseModel
    {
        public Guid Token { get; set; } = Guid.NewGuid();
        public required DateTime Expires { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }
    }
}
