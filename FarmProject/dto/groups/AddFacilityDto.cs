namespace FarmProject.dto.groups
{
    public class AddFacilityDto
    {
        public required string Name { get; set; } = "";
        public required string Inn { get; set; }
        public required string Ogrn { get; set; }
        public required string Adress { get; set; }
        public required DateTime RegistrationDate { get; set; }
        public required string ContactData { get; set; }
        public required string AdditionalData { get; set; }
        public required List<string> Groups { get; set; }
        public required List<string> Sections { get; set; }
    }
}
