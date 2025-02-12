using DewLib.db;

namespace FarmProject.db.models;

public class User : BaseModel
{
    public required string Key { get; set; }
}
