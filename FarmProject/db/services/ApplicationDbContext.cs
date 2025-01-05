using FarmProject.db.configs;
using FarmProject.db.models;
using Microsoft.EntityFrameworkCore;

namespace FarmProject.db.services;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext() : base()
    {
        Database.EnsureCreated();
    }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
        var config = new ConfigurationBuilder()
                        .AddJsonFile("appsettings.json")
                        .SetBasePath(Directory.GetCurrentDirectory())
                        .Build();

        optionsBuilder.UseNpgsql(config.GetConnectionString("DefaultConnection"));

    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfiguration(new PressureSensorConfiguration());

        modelBuilder.Entity<PressureSensor>().HasData(
                new PressureSensor()
                {
                    Id = Guid.NewGuid(),
                    GPS = "gps",
                    IMEI = "1"
                }
            );
        modelBuilder.Entity<PressureMeasurements>().ToTable("PressureMeaserments").HasData(
                new PressureMeasurements()
                {
                    Id = Guid.NewGuid(),
                    IMEI = "1",
                    PRR1 = 25.3,
                    PRR2 = 26,
                }
            );
    }
}
