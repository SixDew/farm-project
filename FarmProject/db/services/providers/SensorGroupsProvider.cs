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
    }
}
