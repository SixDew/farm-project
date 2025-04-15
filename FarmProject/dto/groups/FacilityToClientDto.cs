namespace FarmProject.dto.groups
{
    public class FacilityToClientDto
    {
        public required string Name { get; set; } = "";

        public List<SectionToClientDto> Sections { get; set; }
        public List<GroupToClientDto> Groups { get; set; }
        public required int Id { get; set; }
    }
}
