using FarmProject.group_feature.section;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FarmProject.db.configs
{
    public class SectionConfiguration : IEntityTypeConfiguration<Section>
    {
        public void Configure(EntityTypeBuilder<Section> builder)
        {
            builder.OwnsOne(s => s.Metadata);
            builder.HasMany(s => s.sensorGroups).WithOne().HasForeignKey(g => g.SectionId).HasPrincipalKey(s => s.Id);
        }
    }
}
