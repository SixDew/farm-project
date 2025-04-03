using FarmProject.group_feature.group;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FarmProject.db.configs
{
    public class SensorGroupsConfiguration : IEntityTypeConfiguration<SensorGroup>
    {
        public void Configure(EntityTypeBuilder<SensorGroup> builder)
        {
            builder.OwnsOne(g => g.Metadata);
        }
    }
}
