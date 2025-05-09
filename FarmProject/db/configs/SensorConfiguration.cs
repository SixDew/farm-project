using FarmProject.db.models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FarmProject.db.configs;

public class SensorConfiguration : IEntityTypeConfiguration<Sensor>
{
    public void Configure(EntityTypeBuilder<Sensor> builder)
    {
        builder.ToTable("PressureSensors").HasMany(s => s.Measurements).WithOne(m => m.PressureSensor)
            .HasForeignKey(m => m.IMEI).HasPrincipalKey(s => s.IMEI);

        builder.HasOne(s => s.Settings).WithOne().HasForeignKey<SensorSettings>(settings => settings.IMEI)
            .HasPrincipalKey<Sensor>(s => s.IMEI);

        builder.HasMany(s => s.AlarmedMeasurements).WithOne(m => m.Sensor).HasForeignKey(m => m.Imei).HasPrincipalKey(s => s.IMEI);
    }
}
