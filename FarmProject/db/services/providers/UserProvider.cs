using DewLib.db;
using FarmProject.auth;
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

        public async Task<User?> GetAdminByKey(string key)
        {
            return await _dbSet.FirstOrDefaultAsync(x => x.Key == key && x.Role == UserRoles.ADMIN);
        }

        public async Task<User?> GetUserByKey(string key)
        {
            return await _dbSet.FirstOrDefaultAsync(x => x.Key == key && x.Role == UserRoles.USER);
        }

        public async Task<List<User>> GetUsers()
        {
            return await _dbSet.Where(x => x.Role == UserRoles.USER).ToListAsync();
        }
    }
}
