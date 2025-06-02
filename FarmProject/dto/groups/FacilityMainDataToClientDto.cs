namespace FarmProject.dto.groups
{
    public class FacilityMainDataToClientDto
    {
        public required int Id { get; set; }
        public required string Name { get; set; } = "";
        public required string Inn { get; set; }
        public required string Ogrn { get; set; }
        public required string Adress { get; set; }
        public required DateTime RegistrationDate { get; set; }
        public required string ContactData { get; set; }
        public required string AdditionalData { get; set; }
    }
}
