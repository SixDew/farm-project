using DewLib.db;
using FarmProject.db.models;

namespace FarmProject.db.services.providers
{
    public class RefreshTokensProvider(ApplicationDbContext db) : DbProvider<RefreshToken>(db)
    {
    }
}
