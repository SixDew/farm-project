namespace FarmProject.dto.groups
{
    public class MainDataFacilityDto
    {
        public required int Id { get; set; }
        public required string Name { get; set; } = "";
        public required string INN { get; set; }
        public required string OGRN { get; set; }
        public required string Adress { get; set; }
        public required DateTime RegistrationDate { get; set; }
        public required string ContactData { get; set; }
        public required string AdditionalData { get; set; }
    }
}
