using DewLib.db;
using FarmProject.group_feature.group;
using FarmProject.group_feature.section;
using Microsoft.EntityFrameworkCore;

namespace FarmProject.group_feature;

[Index("Inn", IsUnique = true)]
[Index("Ogrn", IsUnique = true)]
public class Facility : BaseModel
{
    public string Name { get; set; } = "";
    public string Inn { get; set; }
    public string Ogrn { get; set; }
    public string Adress { get; set; }
    public DateTime RegistrationDate { get; set; }
    public string ContactData { get; set; }
    public string AdditionalData { get; set; }
    public List<Section> Sections { get; set; } = [];
    public List<SensorGroup> Groups { get; set; } = [];
}
