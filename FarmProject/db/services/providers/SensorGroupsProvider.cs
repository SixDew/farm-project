using DewLib.db;
using FarmProject.group_feature.group;
using Microsoft.EntityFrameworkCore;

namespace FarmProject.db.services.providers
{
    public class SensorGroupsProvider(ApplicationDbContext db) : DbProvider<SensorGroup>(db)
    {
        public async Task<List<SensorGroup>> GetAllAsync()
        {
            return await _dbSet.Include(g => g.Sensors).ToListAsync();
        }

        public async Task<List<SensorGroup>> GetAllOnlyMetadataAsync()
        {
            return await _dbSet.ToListAsync();
        }

        public async Task<SensorGroup?> GetWithSensorsAsync(int id)
        {
            return await _dbSet.Include(g => g.Sensors).FirstOrDefaultAsync(g => g.Id == id);
        }
    }
}
