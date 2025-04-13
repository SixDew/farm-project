using FarmProject.db.models;

namespace FarmProject.dto.map.services
{
    public class MapZoneConverter
    {
        public MapZoneToClientDto ConvertToClient(MapZone zone)
        {
            return new()
            {
                Geometry = zone.Geometry,
                Id = zone.Id,
                Name = zone.Name,
            };
        }

        public MapZone ConvertToModel(MapZoneFromClientDto zone)
        {
            return new() { Geometry = zone.Geometry, Name = zone.Name, SectionId = zone.SectionId };
        }
    }
}
