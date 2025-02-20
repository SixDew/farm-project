using DewLib.db;

namespace FarmProject.db.models;

public class User : BaseModel
{
    public string Name { get; set; }
    public string Phone { get; set; }
    public required string Key { get; set; }
    public required string Role { get; set; }
}
