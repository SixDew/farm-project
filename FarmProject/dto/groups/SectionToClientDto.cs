using FarmProject.dto.map;

namespace FarmProject.dto.groups
{
    public class SectionToClientDto
    {
        public string Name { get; set; }
        public List<PressureSensorToClientDto> Sensors { get; set; }
        public MapZoneToClientDto? Zone { get; set; }
        public int Id { get; set; }
    }
}
