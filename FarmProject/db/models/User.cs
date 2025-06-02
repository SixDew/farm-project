using DewLib.db;
using Microsoft.EntityFrameworkCore;

namespace FarmProject.db.models;

[Index("Login", IsUnique = true)]
public class User : BaseModel
{
    public required string Name { get; set; }
    public required string ContactData { get; set; }
    public required string PersonnelNumber { get; set; }
    public required string Login { get; set; }
    public required string Key { get; set; }
    public required string Role { get; set; }
    public int? FacilityId { get; set; }
    public RefreshToken? RefreshToken { get; set; }
    public List<Notification> Notifications { get; set; } = new();
}
