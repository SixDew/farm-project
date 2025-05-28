namespace FarmProject.dto.sensor_things
{
    public record ObservationDto(
    long Id,
    DateTime PhenomenonTime,
    double Result,
    long Datastream
);
}
