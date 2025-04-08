using FarmProject.group_feature.group;

namespace FarmProject.dto.groups
{
    public class GroupMetadataToClientDto
    {
        public required GroupMetadata Metadata { get; set; }
        public required int Id { get; set; }
    }
}
