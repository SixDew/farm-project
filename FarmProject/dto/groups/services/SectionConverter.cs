using FarmProject.group_feature.section;

namespace FarmProject.dto.groups.services;

public class SectionConverter(GroupConverter _groupConverter)
{
    public SectionToClientDto ConvertToClientDto(Section section)
    {
        return new()
        {
            Metadata = section.Metadata,
            Groups = section.sensorGroups.Select(_groupConverter.ConvertToClient).ToList(),
            Id = section.Id
        };
    }
}
