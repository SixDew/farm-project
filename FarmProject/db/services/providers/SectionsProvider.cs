using DewLib.db;
using FarmProject.group_feature.section;
using Microsoft.EntityFrameworkCore;

namespace FarmProject.db.services.providers
{
    public class SectionsProvider(ApplicationDbContext db) : DbProvider<Section>(db)
    {
        public async Task<List<Section>> GetAllAsync()
        {
            return await _dbSet.Include(s => s.Sensors).Include(s => s.Zone).ToListAsync();
        }

        public async Task<Section?> GetWithSensorsAsync(int id)
        {
            return await _dbSet.Include(s => s.Sensors).FirstOrDefaultAsync(s => s.Id == id);
        }
    }
}
