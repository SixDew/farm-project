using FarmProject.db.models;

namespace FarmProject.predict
{
    public interface IPredictService
    {
        public Task<PredictOutputData> PredictWarningSituation(string sensorImei,
           Measurements measurements,
           double dataSendingSpan,
           TimeSpan windowSize);
    }
}
