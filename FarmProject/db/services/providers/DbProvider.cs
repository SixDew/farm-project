using FarmProject.db.models;
using Microsoft.EntityFrameworkCore;

namespace FarmProject.db.services.providers;

public abstract class DbProvider<T> where T : BaseModel
{
    protected ApplicationDbContext _db;
    protected DbSet<T> _dbSet;
    public DbProvider(ApplicationDbContext db)
    {
        _db = db;
        _dbSet = _db.Set<T>();
    }

    public T? Get(Guid id)
    {
        return _dbSet.FirstOrDefault(t => t.Id == id);
    }
    public async Task<T?> GetAsync(Guid id)
    {
        return await _dbSet.FirstOrDefaultAsync(t => t.Id == id);
    }

    public void Add(T model)
    {
        _dbSet.Add(model);
    }
    public async Task AddAsync(T model)
    {
        await _dbSet.AddAsync(model);
    }

    public void Update(T model)
    {
        _dbSet.Update(model);
    }

    public void Delete(T model)
    {
        _dbSet.Remove(model);
    }

    public T? GetFirstOrDefault(Func<T, bool> predicate)
    {
        return _dbSet.FirstOrDefault(predicate);
    }

    public async Task<T?> GetFirstOrDeafultAsync(System.Linq.Expressions.Expression<Func<T, bool>> expression)
    {
        return await _dbSet.FirstOrDefaultAsync(expression);
    }

    public void SaveChanges()
    {
        _db.SaveChanges();
    }

    public async Task SaveChangesAsync()
    {
        await _db.SaveChangesAsync();
    }
}
