using DewLib.db;
using FarmProject.group_feature.section;
using Microsoft.EntityFrameworkCore;

namespace FarmProject.db.services.providers
{
    public class SectionsProvider(ApplicationDbContext db) : DbProvider<Section>(db)
    {
        public async Task<List<Section>> GetAllAsync()
        {
            return await _dbSet.Include(s => s.sensorGroups).ThenInclude(g => g.Sensors).ToListAsync();
        }
    }
}
