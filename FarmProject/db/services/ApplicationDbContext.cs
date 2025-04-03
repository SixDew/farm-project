using FarmProject.auth;
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
        modelBuilder.ApplyConfiguration(new UserConfiguration());
        modelBuilder.ApplyConfiguration(new PressureAlarmMeasurementsConfiguration());
        modelBuilder.ApplyConfiguration(new SensorGroupsConfiguration());
        modelBuilder.ApplyConfiguration(new SectionConfiguration());
        PressureSensor s1 = new PressureSensor()
        {
            Id = 1,
            GPS = "gps",
            IMEI = "1",
        };
        PressureSensor s2 = new PressureSensor()
        {
            Id = 2,
            GPS = "gps",
            IMEI = "2",
        };
        modelBuilder.Entity<PressureSensor>().HasData([s1, s2]);

        modelBuilder.Entity<PressureMeasurements>().ToTable("PressureMeaserments").HasData(
                new PressureMeasurements()
                {
                    Id = 1,
                    IMEI = "1",
                    PRR1 = 25.3,
                    PRR2 = 26,
                }
            );

        modelBuilder.Entity<PressureSensorSettings>().ToTable("PressureSensorSettings").HasData(
                new PressureSensorSettings()
                {
                    Id = 1,
                    IMEI = "1"
                },
                new PressureSensorSettings()
                {
                    Id = 2,
                    IMEI = "2"
                }
            );
        modelBuilder.Entity<User>().ToTable("Users").HasData(
            [new User() { Id = 1, Key = "test", Role = UserRoles.USER, Name="testName", Phone="88888888888" },
            new User(){ Id= 2, Key = "admintest", Role = UserRoles.ADMIN, Name="testName", Phone="88888888888"}
        ]
            );
    }
}