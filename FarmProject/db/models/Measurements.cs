using DewLib.db;

namespace FarmProject.db.models
{
    public class Measurements : BaseModel
    {
        public double PRR1 { get; set; }
        public double PRR2 { get; set; }
        public required string IMEI { get; set; }
        public DateTime MeasurementsTime { get; set; } = DateTime.UtcNow;
        public Sensor PressureSensor { get; set; }
    }
}
