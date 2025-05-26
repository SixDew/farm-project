using System.ComponentModel.DataAnnotations;
using DewLib.db;
using FarmProject.group_feature.group;
using FarmProject.group_feature.section;

namespace FarmProject.db.models
{
    public class Sensor : BaseModel, ISensorGroupElement
    {
        public required string GPS { get; set; }
        public required string IMEI { get; set; }
        public bool IsActive { get; set; } = false;
        //-------------------------Nav---------------------------------
        public List<Measurements> Measurements { get; set; } = new();
        public List<AlarmedMeasurements> AlarmedMeasurements { get; set; } = new();
        [Required]
        public SensorSettings Settings { get; set; }
        public List<SensorGroup> Groups { get; set; } = new();
        public Section? Section { get; set; }
        public int? SectionId { get; set; }
    }
}
