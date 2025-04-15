using DewLib.db;
using FarmProject.group_feature.group;
using FarmProject.group_feature.section;

namespace FarmProject.group_feature;

public class Facility : BaseModel
{
    public string Name { get; set; } = "";

    public List<Section> Sections { get; set; } = [];
    public List<SensorGroup> Groups { get; set; } = [];
}
