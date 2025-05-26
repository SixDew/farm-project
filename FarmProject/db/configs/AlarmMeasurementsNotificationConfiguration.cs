using FarmProject.db.models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FarmProject.db.configs
{
    public class AlarmMeasurementsNotificationConfiguration : IEntityTypeConfiguration<AlarmMesurementsNotification>
    {
        public void Configure(EntityTypeBuilder<AlarmMesurementsNotification> builder)
        {
            builder.ToTable("AlarmMesurementsNotifications");
        }
    }
}
