using DewLib.db;

namespace FarmProject.db.models;

public class AlarmedPressureMeasurements : BaseModel
{
    public required string Imei { get; set; }
    public int MeasurementId { get; set; }
    public bool isChecked { get; set; }

    public PressureMeasurements Measurements { get; set; }
    public PressureSensor Sensor { get; set; }
}
