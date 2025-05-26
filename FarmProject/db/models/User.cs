using DewLib.db;

namespace FarmProject.db.models;

public class User : BaseModel
{
    public string Name { get; set; }
    public string ContactData { get; set; }
    public required string Key { get; set; }
    public required string Role { get; set; }
    public required int FacilityId { get; set; }
    public List<Notification> Notifications { get; set; } = new();
}
