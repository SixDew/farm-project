using DewLib.db;

namespace FarmProject.db.models
{
    public class SensorSettings : BaseModel
    {
        public double DeviationSpanPositive { get; set; }
        public double DeviationSpanNegative { get; set; }
        public double Sensitivity { get; set; }
        public bool AlarmActivated { get; set; } = true;
        public bool FirstSensorIsActive { get; set; }
        public bool SecondSensorIsActive { get; set; }
        public double DataSendingSpan { get; set; } = 10;

        public required string IMEI { get; set; }

    }
}
