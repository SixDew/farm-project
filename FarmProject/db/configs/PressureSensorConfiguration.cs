using FarmProject.db.models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FarmProject.db.configs;

public class PressureSensorConfiguration : IEntityTypeConfiguration<PressureSensor>
{
    public void Configure(EntityTypeBuilder<PressureSensor> builder)
    {
        builder.ToTable("PressureSensors").HasMany(s => s.Measurements).WithOne(m => m.PressureSensor)
            .HasForeignKey(m => m.IMEI).HasPrincipalKey(s => s.IMEI);

        builder.HasOne(s => s.Settings).WithOne().HasForeignKey<PressureSensorSettings>(settings => settings.IMEI)
            .HasPrincipalKey<PressureSensor>(s => s.IMEI);

        builder.HasMany(s => s.AlarmedMeasurements).WithOne(m => m.Sensor).HasForeignKey(m => m.Imei).HasPrincipalKey(s => s.IMEI);
    }
}
