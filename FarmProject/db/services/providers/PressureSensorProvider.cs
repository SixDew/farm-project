using DewLib.db;
using FarmProject.db.models;
using Microsoft.EntityFrameworkCore;

namespace FarmProject.db.services.providers;

public class PressureSensorProvider(DbContext db) : DbProvider<PressureSensor>(db)
{
}
