using FarmProject.db.models;

namespace FarmProject.dto.servisces
{
    public class PressureMeasurmentsDtoConvertService
    {
        public PressureMeasurementsToClientDto ConvertToClientDto(PressureMeasurements measurments)
        {
            return new PressureMeasurementsToClientDto()
            {
                Measurment1 = measurments.PRR1,
                Measurment2 = measurments.PRR2,
                MeasurmentsTime = measurments.MeasurementsTime
            };
        }

        public PressureMeasurements ConvertToModel(PressureMeasurementsFromSensorDto measurments, Guid sensorId)
        {
            return new PressureMeasurements()
            {
                IMEI = measurments.IMEI,
                PRR1 = measurments.PRR1,
                PRR2 = measurments.PRR2,
                Id = sensorId
            };
        }
    }
}
