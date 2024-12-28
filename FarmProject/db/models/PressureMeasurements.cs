using DewLib.db;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmProject.db.models
{
    public class PressureMeasurements : BaseModel
    {
        public double PRR1 { get; set; }
        public double PRR2 { get; set; }
        public required string IMEI { get; set; }

        [ForeignKey("IMEI")]
        public PressureSensor PressureSensor { get; set; }
    }
}
