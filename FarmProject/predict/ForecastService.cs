using FarmProject.db.models;
using FarmProject.db.services.providers;
using FarmProject.hubs.services;
using Microsoft.Extensions.Caching.Memory;

namespace FarmProject.predict;

public class ForecastService(IPredictService _predictService, IServiceProvider _services, IMemoryCache _memoryCache)
{
    public TimeSpan _Interval { get; set; } = TimeSpan.FromMinutes(60);
    public TimeSpan _WindowSize { get; set; } = TimeSpan.FromMinutes(30);

    public async Task DriftAnalize(Measurements measurements)
    {
        SensorSettings? settings;
        using (var scope = _services.CreateScope())
        {
            var sensors = scope.ServiceProvider.GetRequiredService<SensorsProvider>();

            settings = await sensors.GetSettingsByImeiAsync(measurements.IMEI);
        }

        if (settings is null)
        {
            throw new ArgumentException("Sensor is not exist");
        }

        var predictData = await _predictService.PredictWarningSituation(
            measurements.IMEI,
            measurements,
            settings.DataSendingSpan,
            _WindowSize
            );

        if (predictData.isWarning1 && predictData.Slope1 != 0)
        {
            await sendDriftNotify(settings, measurements.PRR1, predictData, measurements.Id);
        }
        if (predictData.isWarning2 && predictData.Slope2 != 0)
        {
            await sendDriftNotify(settings, measurements.PRR2, predictData, measurements.Id);
        }
    }

    private async Task sendDriftNotify(SensorSettings settings, float lastMeasurement, PredictOutputData predictData, int measurementId)
    {
        var intervalSeconds = _Interval.TotalSeconds;
        float secondsToTreshold = 0;
        if (predictData.Slope1 > 0)
        {
            float treshold = settings.DeviationSpanPositive;
            secondsToTreshold = (treshold - lastMeasurement) / predictData.Slope1 * settings.DataSendingSpan;

        }
        if (predictData.Slope1 < 0)
        {
            float treshold = settings.DeviationSpanNegative;
            secondsToTreshold = (lastMeasurement - treshold) / -predictData.Slope1 * settings.DataSendingSpan;
        }

        TimeSpan timeSpanToTranshold = TimeSpan.FromSeconds(secondsToTreshold);

        if (secondsToTreshold > 0 && timeSpanToTranshold <= _Interval)
        {
            string cacheKey = $"LastNotify:{settings.IMEI}";
            TimeSpan notifyWindow = TimeSpan.FromTicks(_Interval.Ticks / 3);
            if (!_memoryCache.TryGetValue(cacheKey, out DateTime lastNotifyTime) || (DateTime.UtcNow - lastNotifyTime) >= notifyWindow)
            {
                using (var scope = _services.CreateScope())
                {
                    var measurementsHubService = scope.ServiceProvider.GetRequiredService<MeasurementsHubService>();
                    _memoryCache.Set(cacheKey, DateTime.UtcNow, notifyWindow);
                    await measurementsHubService.SendForecastWarningNotifyAsync(settings.IMEI, timeSpanToTranshold, measurementId);
                    Console.WriteLine("Send warning");
                }
            }
        }
    }
}
