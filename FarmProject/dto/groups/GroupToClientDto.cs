using FarmProject.group_feature.group;

namespace FarmProject.dto.groups
{
    public class GroupToClientDto
    {
        public GroupMetadata Metadata { get; set; } = new();
        public List<PressureSensorToClientDto> Sensors { get; set; } = new();
        public int Id { get; set; }
    }
}
