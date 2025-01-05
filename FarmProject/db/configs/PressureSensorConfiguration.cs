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
    }
}
