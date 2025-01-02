using FarmProject.db.models;
using Microsoft.EntityFrameworkCore;

namespace FarmProject.db.services;

public class ApplicationDbContext : DbContext
{
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
        Database.EnsureCreated();

    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<PressureSensor>().ToTable("PressureSensors").HasData(
                new PressureSensor()
                {
                    GPS = "gps",
                    IMEI = "1"
                }
            );
        modelBuilder.Entity<PressureMeasurements>().ToTable("PressureMeaserments").HasData(
                new PressureMeasurements()
                {
                    IMEI = "1",
                    PRR1 = 25.3,
                    PRR2 = 26,
                }
            );
    }
}
