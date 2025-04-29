using DewLib.db;
using FarmProject.db.models;
using FarmProject.group_feature.group;
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

    public async Task<List<PressureSensor>?> GetAllAsync()
    {
        return await _dbSet.ToListAsync();
    }

    public async Task<List<PressureSensor>> GetDisabled()
    {
        return await _dbSet.Where(s => s.IsActive == false).ToListAsync();
    }

    public async Task<List<AlarmedPressureMeasurements>?> GetAlarmedMeasurementsAsync(string imei)
    {
        var sensor = await _dbSet.Include(s => s.AlarmedMeasurements).ThenInclude(am => am.Measurements).FirstOrDefaultAsync(x => x.IMEI == imei);
        return sensor?.AlarmedMeasurements;
    }

    public async Task<List<SensorGroup>?> GetGroupsAsync(string imei)
    {
        var sensor = await _dbSet.Include(s => s.Groups).FirstOrDefaultAsync(s => s.IMEI == imei);
        if (sensor is null)
        {
            return null;
        }
        return sensor.Groups;
    }

    public async Task<List<AlarmedPressureMeasurements>?> GetCheckedAlarmedMeasurementsAsync(string imei)
    {
        var sensor = await _dbSet.Include(s => s.AlarmedMeasurements.Where(am => am.isChecked)).ThenInclude(am => am.Measurements)
            .FirstOrDefaultAsync(s => s.IMEI == imei);
        return sensor?.AlarmedMeasurements;
    }

    public async Task<List<AlarmedPressureMeasurements>?> GetUncheckedAlarmedMeasurementsAsync(string imei)
    {
        var sensor = await _dbSet.Include(s => s.AlarmedMeasurements.Where(am => !am.isChecked)).ThenInclude(am => am.Measurements)
            .FirstOrDefaultAsync(s => s.IMEI == imei);
        return sensor?.AlarmedMeasurements;
    }
}
