using FarmProject.group_feature.section;

namespace FarmProject.dto.groups
{
    public class SectionDeepMetadataToClientDto
    {
        public SectionMetadata Metadata { get; set; }
        public List<GroupMetadataToClientDto> GroupsMetadata { get; set; }
        public int Id { get; set; }
    }
}
