using DewLib.db;
using NetTopologySuite.Geometries;

namespace FarmProject.db.models
{
    public class MapZone : BaseModel
    {
        public string Name { get; set; } = "";
        public required Geometry Geometry { get; set; }
    }
}
