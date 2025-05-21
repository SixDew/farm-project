using DewLib.db;

namespace FarmProject.db.models
{
    public class SensorSettings : BaseModel
    {
        public float DeviationSpanPositive { get; set; } = 100;
        public float DeviationSpanNegative { get; set; } = 30;
        public float Sensitivity { get; set; }
        public bool AlarmActivated { get; set; } = true;
        public bool FirstSensorIsActive { get; set; } = true;
        public bool SecondSensorIsActive { get; set; } = true;
        public float DataSendingSpan { get; set; } = 5;

        public required string IMEI { get; set; }

    }
}
