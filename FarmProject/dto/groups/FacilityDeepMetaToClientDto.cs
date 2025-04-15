namespace FarmProject.dto.groups
{
    public class FacilityDeepMetaToClientDto
    {
        public string Name { get; set; } = "";

        public List<SectionMetadataToClientDto> Sections { get; set; }
        public List<GroupMetadataToClientDto> Groups { get; set; }
        public required int Id { get; set; }
    }
}
