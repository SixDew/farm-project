using FarmProject.group_feature;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FarmProject.db.configs
{
    public class FacilityConfiguration : IEntityTypeConfiguration<Facility>
    {
        public void Configure(EntityTypeBuilder<Facility> builder)
        {
            builder.HasMany(f => f.Sections).WithOne().HasForeignKey(s => s.FacilityId).HasPrincipalKey(f => f.Id);
            builder.HasMany(f => f.Groups).WithOne().HasForeignKey(g => g.FacilityId).HasPrincipalKey(f => f.Id);
        }
    }
}
