using DewLib.db;
using FarmProject.db.models;
using FarmProject.group_feature.group;

namespace FarmProject.group_feature.section
{
    public class Section : BaseModel
    {
        public SectionMetadata Metadata { get; set; } = new();
        public List<SensorGroup> sensorGroups = new();

        public MapZone? Zone { get; set; } = null;
    }
}
