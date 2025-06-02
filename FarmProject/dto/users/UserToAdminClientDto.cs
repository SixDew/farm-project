namespace FarmProject.dto.users;

public class UserToAdminClientDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public required string PersonnelNumber { get; set; }
    public string ContactData { get; set; }
    public string Login { get; set; }
    public string Role { get; set; }
    public int FacilityId { get; set; }
}
