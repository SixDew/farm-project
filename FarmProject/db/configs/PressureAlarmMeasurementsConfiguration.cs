using FarmProject.db.models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FarmProject.db.configs;

public class PressureAlarmMeasurementsConfiguration : IEntityTypeConfiguration<AlarmedPressureMeasurements>
{
    public void Configure(EntityTypeBuilder<AlarmedPressureMeasurements> builder)
    {
        builder.HasOne(am => am.Measurements).WithOne().HasForeignKey<AlarmedPressureMeasurements>(am => am.MeasurementId).
            HasPrincipalKey<PressureMeasurements>(m => m.Id);
    }
}
