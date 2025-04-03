using DewLib.db;
using FarmProject.group_feature.group;
using System.ComponentModel.DataAnnotations;

namespace FarmProject.db.models
{
    public class PressureSensor : BaseModel, ISensorGroupElement
    {
        public required string GPS { get; set; }
        public required string IMEI { get; set; }
        public bool IsActive { get; set; } = false;

        public List<PressureMeasurements> Measurements { get; set; } = new();
        public List<AlarmedPressureMeasurements> AlarmedMeasurements { get; set; } = new();
        [Required]
        public PressureSensorSettings Settings { get; set; }
        public List<SensorGroup> Groups { get; set; } = new();
    }
}
