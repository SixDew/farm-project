using Microsoft.EntityFrameworkCore;

namespace FarmProject.group_feature.group
{
    [Owned]
    public class GroupMetadata
    {
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
    }
}
