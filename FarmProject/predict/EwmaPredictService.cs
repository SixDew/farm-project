using FarmProject.db.models;
using FarmProject.db.services.providers;

namespace FarmProject.predict
{
    public class EwmaPredictService(IServiceProvider _services) : IPredictService
    {
        private double _smoothing = 0.85;
        private double _sensitivity = 1.5;
        public async Task<PredictOutputData> PredictWarningSituation(string sensorImei,
            Measurements measurements,
            double dataSendingSpan,
            TimeSpan windowSize)
        {
            int windowMeasurementsNum = calcWindowMeasurementsNum(windowSize, dataSendingSpan);
            var outputData = new PredictOutputData();

            List<Measurements>? windowMeasurements = new();
            using (var scope = _services.CreateScope())
            {
                var sensors = scope.ServiceProvider.GetRequiredService<SensorsProvider>();
                windowMeasurements = await sensors.GetLastMeasurmentsByImeiAync(sensorImei, windowMeasurementsNum);
            }
            if (windowMeasurements is null)
            {
                return new PredictOutputData();
            }

            bool drift1 = calcDrift(new PredictInputData() { Values = windowMeasurements.Select(m => m.PRR1).ToArray() });
            bool drift2 = calcDrift(new PredictInputData() { Values = windowMeasurements.Select(m => m.PRR2).ToArray() });

            if (drift1)
            {
                float slope = calcSlope(new PredictInputData() { Values = windowMeasurements.Select(m => m.PRR1).ToArray() });
                outputData.isWarning1 = true;
                outputData.Slope1 = slope;
            }
            if (drift2)
            {
                float slope = calcSlope(new PredictInputData() { Values = windowMeasurements.Select(m => m.PRR2).ToArray() });
                outputData.isWarning2 = true;
                outputData.Slope2 = slope;
            }


            return outputData;
        }

        private int calcWindowMeasurementsNum(TimeSpan windowSize, double dataSendingSpan)
        {
            return (int)(windowSize.Ticks / TimeSpan.FromSeconds(dataSendingSpan).Ticks);
        }

        private bool calcDrift(PredictInputData data)
        {
            double lambda = _smoothing, L = _sensitivity;
            double mu = data.Values.Average(), sigma = Math.Sqrt(data.Values.Sum(v => Math.Pow(v - mu, 2)) / data.Values.Count());
            double S = data.Values[0];
            for (int i = 1; i < data.Values.Count(); i++) S = lambda * data.Values[i] + (1 - lambda) * S;
            return Math.Abs(S - mu) > L * sigma;
        }

        private float calcSlope(PredictInputData data)
        {
            var y = data.Values.Select((v, i) => new { i, v }).OrderBy(p => p.i).ToList();
            var x = y.Select(p => (float)p.i).ToArray();
            var ys = y.Select(p => p.v).ToArray();
            var xMean = x.Average(); var yMean = ys.Average();
            var num = x.Zip(ys, (xi, yi) => (xi - xMean) * (yi - yMean)).Sum();
            var den = x.Sum(xi => (xi - xMean) * (xi - xMean));
            return num / den;
        }
    }
}
