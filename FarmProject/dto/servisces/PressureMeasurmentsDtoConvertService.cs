using FarmProject.db.models;

namespace FarmProject.dto.servisces
{
    public class PressureMeasurmentsDtoConvertService
    {
        public PressureMeasurmentsDto Convert(PressureMeasurements measurments)
        {
            return new PressureMeasurmentsDto()
            {
                Measurment1 = measurments.PRR1,
                Measurment2 = measurments.PRR2,
                MeasurmentsTime = measurments.MeasurementsTime
            };
        }
    }
}
