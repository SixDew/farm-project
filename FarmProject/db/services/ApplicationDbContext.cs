using FarmProject.auth;
using FarmProject.db.configs;
using FarmProject.db.models;
using FarmProject.group_feature;
using FarmProject.group_feature.group;
using FarmProject.group_feature.section;
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

        optionsBuilder.UseNpgsql(config.GetConnectionString("DefaultConnection"), o => o.UseNetTopologySuite());

    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfiguration(new SensorConfiguration());
        modelBuilder.ApplyConfiguration(new UserConfiguration());
        modelBuilder.ApplyConfiguration(new AlarmMeasurementsConfiguration());
        modelBuilder.ApplyConfiguration(new SectionConfiguration());
        modelBuilder.ApplyConfiguration(new FacilityConfiguration());

        modelBuilder.Entity<MapZone>().ToTable("MapZones");

        Sensor s1 = new Sensor()
        {
            Id = 1,
            GPS = "53.36 38.123",
            IMEI = "1",
            IsActive = true,
            SectionId = 1,
        };
        Sensor s2 = new Sensor()
        {
            Id = 2,
            GPS = "55.15 35.141",
            IMEI = "2",
            IsActive = true,
            SectionId = 1,
        };
        Sensor s3 = new Sensor()
        {
            Id = 3,
            GPS = "54.15 34.141",
            IMEI = "3",
            IsActive = true,
            SectionId = 2,
        };
        Sensor s4 = new Sensor()
        {
            Id = 4,
            GPS = "56.15 36.141",
            IMEI = "4",
            IsActive = false,
            SectionId = 2,
        };
        modelBuilder.Entity<Sensor>().HasData([s1, s2, s3, s4]);

        modelBuilder.Entity<Measurements>().ToTable("PressureMeaserments").HasData(
                new Measurements()
                {
                    Id = 1,
                    IMEI = "1",
                    PRR1 = 25.3,
                    PRR2 = 26,
                }
            );

        modelBuilder.Entity<Facility>().HasData(new Facility()
        {
            Id = 1,
            Name = "Мое предприятие"
        });

        modelBuilder.Entity<Section>().HasData([new Section()
        {
            Id = 1,
            FacilityId = 1,
            Name = "Поле 1"
        },
        new Section()
        {
            Id = 2,
            FacilityId = 1,
            Name = "Поле 2"
        }]);

        modelBuilder.Entity<SensorGroup>().HasData([new SensorGroup()
        {
            Id = 1,
            Name = "Влажность почвы",
            FacilityId = 1
        },
        new SensorGroup()
        {
            Id = 2,
            Name = "Давление насосов",
            FacilityId = 1
        }]);

        modelBuilder.Entity<SensorSettings>().ToTable("PressureSensorSettings").HasData(
                new SensorSettings()
                {
                    Id = 1,
                    IMEI = "1"
                },
                new SensorSettings()
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