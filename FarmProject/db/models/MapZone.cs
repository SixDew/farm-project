using NetTopologySuite.Geometries;

namespace FarmProject.db.models
{
    public class MapZone
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public required Geometry Geometry { get; set; }
    }
}
