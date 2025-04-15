using DewLib.db;
using FarmProject.db.models;

namespace FarmProject.group_feature.section
{
    public class Section : BaseModel
    {
        public string Name { get; set; } = "";
        public List<PressureSensor> Sensors = new();
        public MapZone? Zone { get; set; } = null;
        public int FacilityId { get; set; }
    }
}
