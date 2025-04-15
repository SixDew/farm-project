using FarmProject.dto.map.services;
using FarmProject.group_feature.section;

namespace FarmProject.dto.groups.services;

public class SectionConverter(GroupConverter _groupConverter, MapZoneConverter _zoneConverter)
{
    public SectionToClientDto ConvertToClientDto(Section section)
    {
        if (section.Zone is null)
        {
            return new()
            {
                Metadata = section.Metadata,
                Groups = section.sensorGroups.Select(_groupConverter.ConvertToClient).ToList(),
                Id = section.Id,
            };
        }
        else
        {
            return new()
            {
                Metadata = section.Metadata,
                Groups = section.sensorGroups.Select(_groupConverter.ConvertToClient).ToList(),
                Id = section.Id,
                Zone = _zoneConverter.ConvertToClient(section.Zone)
            };
        }
    }

    public SectionDeepMetadataToClientDto ConvertToDeepMetadata(Section section)
    {
        return new()
        {
            Id = section.Id,
            Metadata = section.Metadata,
            GroupsMetadata = section.sensorGroups.Select(_groupConverter.ConvertToMetadata).ToList()
        };
    }
}
