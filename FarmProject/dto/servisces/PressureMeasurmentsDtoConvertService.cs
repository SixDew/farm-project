using FarmProject.db.models;

namespace FarmProject.dto.servisces
{
    public class PressureMeasurmentsDtoConvertService
    {
        public PressureMeasurmentsToClientDto Convert(PressureMeasurements measurments)
        {
            return new PressureMeasurmentsToClientDto()
            {
                Measurment1 = measurments.PRR1,
                Measurment2 = measurments.PRR2,
                MeasurmentsTime = measurments.MeasurementsTime
            };
        }
    }
}
