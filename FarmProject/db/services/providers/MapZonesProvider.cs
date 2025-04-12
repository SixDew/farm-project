using DewLib.db;
using FarmProject.db.models;
using Microsoft.EntityFrameworkCore;

namespace FarmProject.db.services.providers
{
    public class MapZonesProvider(ApplicationDbContext db) : DbProvider<MapZone>(db)
    {
        public async Task<List<MapZone>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }
    }
}
