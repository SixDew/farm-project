using NetTopologySuite.Geometries;

namespace FarmProject.dto.map
{
    public class MapZoneFromClientDto
    {
        public required Geometry Geometry { get; set; }
        public required int SectionId { get; set; }
    }
}
