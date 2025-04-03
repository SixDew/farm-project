using FarmProject.dto.servisces;
using FarmProject.group_feature.group;

namespace FarmProject.dto.groups.services;

public class GroupConverter(PressureSensorDtoConvertService _sensorConverter)
{
    public GroupToClientDto ConvertToClient(SensorGroup group)
    {
        return new()
        {
            Metadata = group.Metadata,
            Sensors = group.Sensors.Select(_sensorConverter.ConvertToClient).ToList(),
            Id = group.Id
        };
    }
}