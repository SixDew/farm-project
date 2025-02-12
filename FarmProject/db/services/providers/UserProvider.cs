using DewLib.db;
using FarmProject.db.models;
using Microsoft.EntityFrameworkCore;

namespace FarmProject.db.services.providers
{
    public class UserProvider(ApplicationDbContext db) : DbProvider<User>(db)
    {
        public async Task<User?> GetByKey(string key)
        {
            return await _dbSet.FirstOrDefaultAsync(x => x.Key == key);
        }
    }
}
