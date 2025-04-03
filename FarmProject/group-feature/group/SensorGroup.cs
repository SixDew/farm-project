using DewLib.db;
using FarmProject.db.models;

namespace FarmProject.group_feature.group
{
    public class SensorGroup : BaseModel
    {
        public GroupMetadata Metadata { get; set; } = new();
        public List<PressureSensor> Sensors { get; set; } = new();
        public int SectionId { get; set; }
    }
}
