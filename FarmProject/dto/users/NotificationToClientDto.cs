namespace FarmProject.dto.users
{
    public class NotificationToClientDto
    {
        public required int Id { get; set; }
        public required bool IsChecked { get; set; }
        public required DateTime CreatedDate { get; set; }
        public required int UserId { get; set; }
        public required string Text { get; set; }
    }
}
