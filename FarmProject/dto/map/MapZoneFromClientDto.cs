using NetTopologySuite.Geometries;

namespace FarmProject.dto.map
{
    public class MapZoneFromClientDto
    {
        public string Name { get; set; } = "";
        public required Geometry Geometry { get; set; }
    }
}
