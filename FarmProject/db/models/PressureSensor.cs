using DewLib.db;
using System.ComponentModel.DataAnnotations;

namespace FarmProject.db.models
{
    public class PressureSensor : BaseModel
    {
        public required string GPS { get; set; }
        public required string IMEI { get; set; }

        public List<PressureMeasurements> Measurements { get; set; } = new();
        [Required]
        public PressureSensorSettings Settings { get; set; }
    }
}
