using FarmProject.db.models;

namespace FarmProject.dto.servisces
{
    public class PressureMeasurmentsDtoConvertService
    {
        public PressureMeasurementsToClientDto ConvertToClientDto(PressureMeasurements measurments)
        {
            return new PressureMeasurementsToClientDto()
            {
                Measurement1 = measurments.PRR1,
                Measurement2 = measurments.PRR2,
                MeasurementsTime = measurments.MeasurementsTime,
                Imei = measurments.IMEI
            };
        }

        public PressureMeasurements ConvertToModel(PressureMeasurementsFromSensorDto measurments)
        {
            return new PressureMeasurements()
            {
                IMEI = measurments.IMEI,
                PRR1 = measurments.PRR1,
                PRR2 = measurments.PRR2,
            };
        }
    }
}
