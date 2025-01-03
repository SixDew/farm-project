using FarmProject.db.models;

namespace FarmProject.dto.servisces
{
    public class PressureMeasurmentsDtoConvertService
    {
        public PressureMeasurmentsToClientDto ConvertToClientDto(PressureMeasurements measurments)
        {
            return new PressureMeasurmentsToClientDto()
            {
                Measurment1 = measurments.PRR1,
                Measurment2 = measurments.PRR2,
                MeasurmentsTime = measurments.MeasurementsTime
            };
        }

        public PressureMeasurements ConvertToModel(PressureMeasurmentsFromSensorDto measurments, Guid sensorId)
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
