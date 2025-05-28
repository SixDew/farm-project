namespace FarmProject.dto.sensor_things
{
    public record DatastreamDto(
    long Id,
    string Name,
    string Description,
    long Thing,
    long Sensor,
    long ObservedProperty
);
}
