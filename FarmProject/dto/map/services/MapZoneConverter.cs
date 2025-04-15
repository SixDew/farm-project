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
                SectionId = zone.SectionId
            };
        }

        public MapZone ConvertToModel(MapZoneFromClientDto zone)
        {
            return new() { Geometry = zone.Geometry, SectionId = zone.SectionId };
        }
    }
}
