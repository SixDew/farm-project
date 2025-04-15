using FarmProject.dto.map;
using FarmProject.group_feature.section;

namespace FarmProject.dto.groups
{
    public class SectionToClientDto
    {
        public SectionMetadata Metadata { get; set; }
        public List<GroupToClientDto> Groups { get; set; }
        public MapZoneToClientDto? Zone { get; set; }
        public int Id { get; set; }
    }
}
