using DewLib.db;
using FarmProject.group_feature.section;
using NetTopologySuite.Geometries;

namespace FarmProject.db.models
{
    public class MapZone : BaseModel
    {
        public string Name { get; set; } = "";
        public required Geometry Geometry { get; set; }

        public Section Section { get; set; }
        public required int SectionId { get; set; }
    }
}
