using DewLib.db;
using FarmProject.auth;
using FarmProject.db.models;
using Microsoft.EntityFrameworkCore;

namespace FarmProject.db.services.providers
{
    public class UserProvider(ApplicationDbContext db) : DbProvider<User>(db)
    {
        public async Task<User?> GetByKeyAsync(string key)
        {
            return await _dbSet.FirstOrDefaultAsync(x => x.Key == key);
        }

        public async Task<User?> GetAdminByKeyAsync(string key)
        {
            return await _dbSet.FirstOrDefaultAsync(x => x.Key == key && x.Role == UserRoles.ADMIN);
        }

        public async Task<User?> GetUserByKeyAsync(string key)
        {
            return await _dbSet.FirstOrDefaultAsync(x => x.Key == key && x.Role == UserRoles.USER);
        }

        public async Task<List<User>> GetUsersAsync()
        {
            return await _dbSet.Where(x => x.Role == UserRoles.USER).ToListAsync();
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _dbSet.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _dbSet.FirstOrDefaultAsync(x => x.Role == UserRoles.USER && x.Id == id);
        }

        public async Task<User?> GetAdminByIdAsync(int id)
        {
            return await _dbSet.FirstOrDefaultAsync(x => x.Role == UserRoles.ADMIN && x.Id == id);
        }
    }
}
