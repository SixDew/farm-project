using DewLib.db;
using FarmProject.auth;
using FarmProject.db.models;
using Microsoft.EntityFrameworkCore;

namespace FarmProject.db.services.providers
{
    public class UserProvider(ApplicationDbContext db) : DbProvider<User>(db)
    {
        public async Task<User?> GetByLoginAsync(string login)
        {
            return await _dbSet.Include(u => u.RefreshToken).FirstOrDefaultAsync(x => x.Login == login);
        }

        public async Task<User?> GetUserByLoginAsync(string login)
        {
            return await _dbSet.Include(u => u.RefreshToken).Where(u => u.Role == UserRoles.USER).FirstOrDefaultAsync(x => x.Login == login);
        }

        public async Task<User?> GetAdminByLoginAsync(string login)
        {
            return await _dbSet.Include(u => u.RefreshToken).Where(u => u.Role == UserRoles.ADMIN).FirstOrDefaultAsync(x => x.Login == login);
        }

        public async Task<List<User>> GetAllAdminsAsync()
        {
            return await _dbSet.Where(u => u.Role == UserRoles.ADMIN).ToListAsync();
        }

        public async Task<User?> GetByTokenAsync(Guid token)
        {
            return await _dbSet.Include(u => u.RefreshToken).FirstOrDefaultAsync(u => u.RefreshToken != null && u.RefreshToken.Token == token);
        }

        public async Task<List<User>> GetAllAdminsWithNotificationsAsync()
        {
            return await _dbSet.Include(u => u.Notifications).Where(u => u.Role == UserRoles.ADMIN).ToListAsync();
        }

        public async Task<List<User>> GetUsersAsync()
        {
            return await _dbSet.Where(x => x.Role == UserRoles.USER).ToListAsync();
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _dbSet.Include(u => u.RefreshToken).FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _dbSet.FirstOrDefaultAsync(x => x.Role == UserRoles.USER && x.Id == id);
        }

        public async Task<User?> GetAdminByIdAsync(int id)
        {
            return await _dbSet.FirstOrDefaultAsync(x => x.Role == UserRoles.ADMIN && x.Id == id);
        }

        public async Task<List<Notification>?> GetNotificationsAsync(int id)
        {
            var user = await _dbSet.Include(u => u.Notifications.OrderByDescending(n => n.CreatedDate)).FirstOrDefaultAsync(u => u.Id == id);
            return user?.Notifications;
        }

        public async Task<List<Notification>?> GetNotificationsAsync(int id, int limit, int offset = 0)
        {
            var user = await _dbSet.Include(u => u.Notifications.OrderByDescending(n => n.CreatedDate)
                .Skip(offset).Take(limit))
                .FirstOrDefaultAsync(u => u.Id == id);
            return user?.Notifications;
        }

        public async Task<List<Notification>?> GetCheckedNotificationsAsync(int id)
        {
            var user = await _dbSet.Include(u => u.Notifications.OrderByDescending(n => n.CreatedDate).Where(n => n.IsChecked)).FirstOrDefaultAsync(u => u.Id == id);
            return user?.Notifications;
        }

        public async Task<List<Notification>?> GetUncheckedNotificationsAsync(int id)
        {
            var user = await _dbSet.Include(u => u.Notifications.OrderByDescending(n => n.CreatedDate).Where(n => !n.IsChecked)).FirstOrDefaultAsync(u => u.Id == id);
            return user?.Notifications;
        }

        public async Task<List<User>?> GetAllFacilityUsersWithNotificationsAsync(int facilityId)
        {
            return await _dbSet.Include(u => u.Notifications.OrderByDescending(n => n.CreatedDate)).Where(u => u.FacilityId == facilityId).ToListAsync();
        }

        public async Task<List<User>> GetAllFacilityUsersAsync(int facilityId)
        {
            return await _dbSet.Where(u => u.FacilityId == facilityId).ToListAsync();
        }
    }
}
