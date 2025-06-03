using DewLib.db;
using FarmProject.db.models;
using FarmProject.group_feature.group;
using Microsoft.EntityFrameworkCore;

namespace FarmProject.db.services.providers;

public class SensorsProvider(ApplicationDbContext db) : DbProvider<Sensor>(db)
{
    public async Task<Sensor?> GetByImeiAsync(string imei)
    {
        return await _dbSet.FirstOrDefaultAsync(s => s.IMEI == imei);
    }
    public async Task<List<Measurements>?> GetMeasurmentsByImeiAync(string imei)
    {
        var sensor = await _dbSet.Include(s => s.Measurements.OrderBy(m => m.Id)).FirstOrDefaultAsync(s => s.IMEI == imei);
        return sensor?.Measurements;
    }
    public async Task<List<Measurements>?> GetLastMeasurmentsByImeiAync(string imei, int num)
    {
        var sensor = await _dbSet.Include(s => s.Measurements.OrderByDescending(m => m.Id).Take(num).OrderBy(m => m.Id)).FirstOrDefaultAsync(s => s.IMEI == imei);
        return sensor?.Measurements;
    }
    public async Task<SensorSettings?> GetSettingsByImeiAsync(string imei)
    {
        var sensor = await _dbSet.Include(s => s.Settings).FirstOrDefaultAsync(s => s.IMEI == imei);
        return sensor?.Settings;
    }
    public async Task<Sensor?> GetByImeiWithMeasurementsAndSettingsAsync(string imei)
    {
        return await _dbSet.Include(s => s.Measurements.OrderBy(m => m.Id)).Include(s => s.Settings).FirstOrDefaultAsync(s => s.IMEI == imei);
    }

    public async Task<List<Sensor>?> GetAllAsync()
    {
        return await _dbSet.ToListAsync();
    }

    public async Task<List<Sensor>> GetDisabled()
    {
        return await _dbSet.Where(s => s.IsActive == false).ToListAsync();
    }

    public async Task<List<AlarmedMeasurements>?> GetAlarmedMeasurementsAsync(string imei)
    {
        var sensor = await _dbSet.Include(s => s.AlarmedMeasurements.OrderBy(m => m.Id)).ThenInclude(am => am.Measurements).FirstOrDefaultAsync(x => x.IMEI == imei);
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

    public async Task<List<AlarmedMeasurements>?> GetCheckedAlarmedMeasurementsAsync(string imei)
    {
        var sensor = await _dbSet.Include(s => s.AlarmedMeasurements.Where(am => am.isChecked).OrderBy(m => m.Id)).ThenInclude(am => am.Measurements)
            .FirstOrDefaultAsync(s => s.IMEI == imei);
        return sensor?.AlarmedMeasurements;
    }

    public async Task<List<AlarmedMeasurements>?> GetUncheckedAlarmedMeasurementsAsync(string imei)
    {
        var sensor = await _dbSet.Include(s => s.AlarmedMeasurements.Where(am => !am.isChecked).OrderBy(m => m.Id)).ThenInclude(am => am.Measurements)
            .FirstOrDefaultAsync(s => s.IMEI == imei);
        return sensor?.AlarmedMeasurements;
    }

    public async Task<Sensor?> GetWithSectoinAsync(string imei)
    {
        return await _dbSet.Include(s => s.Section).FirstOrDefaultAsync(s => s.IMEI == imei);
    }

    public async Task<Sensor?> GetWithAllInnerDataAsync(string imei)
    {
        return await _dbSet.Include(s => s.Measurements.OrderBy(m => m.Id)).Include(s => s.Settings).Include(s => s.Section).FirstOrDefaultAsync(s => s.IMEI == imei);
    }

    public async Task<List<Sensor>> GetAllFacilitySensors(int facilityId)
    {
        return await _dbSet.Include(sensor => sensor.Section).Where(s => s.Section.FacilityId == facilityId).ToListAsync();
    }
}
