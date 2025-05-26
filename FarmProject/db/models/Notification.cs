using DewLib.db;

namespace FarmProject.db.models
{
    public class Notification : BaseModel
    {
        public bool IsChecked { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public int UserId { get; set; }

    }
}
