namespace FarmProject.dto.groups
{
    public class GroupToClientDto
    {
        public string Name { get; set; } = "";
        public List<PressureSensorToClientDto> Sensors { get; set; } = new();
        public int Id { get; set; }
    }
}
