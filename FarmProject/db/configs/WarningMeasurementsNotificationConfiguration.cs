using FarmProject.db.models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FarmProject.db.configs
{
    public class WarningMeasurementsNotificationConfiguration : IEntityTypeConfiguration<WarningMeasurementsNotification>
    {
        public void Configure(EntityTypeBuilder<WarningMeasurementsNotification> builder)
        {
            builder.ToTable("WarningMeasurementNotifications");
        }
    }
}
