using NetTopologySuite.Geometries;

namespace FarmProject.dto.map
{
    public class MapZoneToClientDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public required Geometry Geometry { get; set; }
        public required int SectionId { get; set; }
    }
}
