using FarmProject.group_feature.section;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FarmProject.db.configs
{
    public class SectionConfiguration : IEntityTypeConfiguration<Section>
    {
        public void Configure(EntityTypeBuilder<Section> builder)
        {
            builder.HasMany(s => s.Sensors).WithOne().HasForeignKey(sensor => sensor.SectionId).HasPrincipalKey(s => s.Id)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
