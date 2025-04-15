using DewLib.db;
using FarmProject.group_feature;
using Microsoft.EntityFrameworkCore;

namespace FarmProject.db.services.providers
{
    public class FacilityProvider(ApplicationDbContext db) : DbProvider<Facility>(db)
    {
        public async Task<List<Facility>> GetAllAsync()
        {
            return await _dbSet.Include(f => f.Sections).ThenInclude(s => s.Sensors).Include(f => f.Sections).ThenInclude(s => s.Zone)
                .Include(f => f.Groups).ThenInclude(g => g.Sensors).ToListAsync();
        }

        public async Task<List<Facility>> GetAllDeepMetaAsync()
        {
            return await _dbSet.Include(f => f.Sections).Include(f => f.Groups).ToListAsync();
        }

        public async Task<Facility?> GetWithInnerDataAsync(int id)
        {
            return await _dbSet.Include(f => f.Sections).ThenInclude(s => s.Sensors).Include(f => f.Sections).ThenInclude(s => s.Zone)
                .Include(f => f.Groups).ThenInclude(g => g.Sensors).FirstOrDefaultAsync(f => f.Id == id);
        }
    }
}
