using FarmProject.db.models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FarmProject.db.configs;

public class AlarmMeasurementsConfiguration : IEntityTypeConfiguration<AlarmedMeasurements>
{
    public void Configure(EntityTypeBuilder<AlarmedMeasurements> builder)
    {
        builder.HasOne(am => am.Measurements).WithOne().HasForeignKey<AlarmedMeasurements>(am => am.MeasurementId).
            HasPrincipalKey<Measurements>(m => m.Id);
    }
}
