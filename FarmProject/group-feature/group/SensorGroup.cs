using DewLib.db;
using FarmProject.db.models;

namespace FarmProject.group_feature.group
{
    public class SensorGroup : BaseModel
    {
        public string Name { get; set; } = "";
        public List<Sensor> Sensors { get; set; } = new();
        public int FacilityId { get; set; }
    }
}
