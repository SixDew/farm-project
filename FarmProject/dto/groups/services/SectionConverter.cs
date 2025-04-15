using FarmProject.dto.map.services;
using FarmProject.dto.servisces;
using FarmProject.group_feature.section;

namespace FarmProject.dto.groups.services;

public class SectionConverter(PressureSensorDtoConvertService _sensorConverter, MapZoneConverter _zoneConverter)
{
    public SectionToClientDto ConvertToClientDto(Section section)
    {
        if (section.Zone is null)
        {
            return new()
            {
                Name = section.Name,
                Sensors = section.Sensors.Select(_sensorConverter.ConvertToClient).ToList(),
                Id = section.Id,
            };
        }
        else
        {
            return new()
            {
                Name = section.Name,
                Sensors = section.Sensors.Select(_sensorConverter.ConvertToClient).ToList(),
                Id = section.Id,
                Zone = _zoneConverter.ConvertToClient(section.Zone)
            };
        }
    }

    public SectionMetadataToClientDto ConvertToMetadata(Section section)
    {
        return new()
        {
            Id = section.Id,
            Name = section.Name,
        };
    }
}
