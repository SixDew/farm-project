using DewLib.db;
using FarmProject.db.models;
using Microsoft.EntityFrameworkCore;

namespace FarmProject.db.services.providers;

public class PressureSensorProvider(ApplicationDbContext db) : DbProvider<PressureSensor>(db)
{
    public async Task<PressureSensor?> GetByImeiAsync(string imei)
    {
        return await _dbSet.FirstOrDefaultAsync(s => s.IMEI == imei);
    }
    public async Task<List<PressureMeasurements>?> GetMeasurmentsByImeiAync(string imei)
    {
        var sensor = await _dbSet.Include(s => s.Measurements).FirstOrDefaultAsync(s => s.IMEI == imei);
        return sensor?.Measurements;
    }
    public async Task<PressureSensorSettings?> GetSettingsByImeiAsync(string imei)
    {
        var sensor = await _dbSet.Include(s => s.Settings).FirstOrDefaultAsync(s => s.IMEI == imei);
        return sensor?.Settings;
    }
    public async Task<PressureSensor?> GetByImeiWithMeasurementsAndSettingsAsync(string imei)
    {
        return await _dbSet.Include(s => s.Measurements).Include(s => s.Settings).FirstOrDefaultAsync(s => s.IMEI == imei);
    }
}
