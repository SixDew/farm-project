using DewLib.db;

namespace FarmProject.db.models;

public class AlarmedMeasurements : BaseModel
{
    public required string Imei { get; set; }
    public int MeasurementId { get; set; }
    public bool isChecked { get; set; }

    public Measurements Measurements { get; set; }
    public Sensor Sensor { get; set; }
}
