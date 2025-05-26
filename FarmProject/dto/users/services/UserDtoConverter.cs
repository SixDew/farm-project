using FarmProject.db.models;

namespace FarmProject.dto.users.services;

public class UserDtoConverter
{
    public UserToAdminClientDto ConvertToAdminClientDto(User user)
    {
        return new() { Key = user.Key, Role = user.Role, Name = user.Name, ContactData = user.ContactData, Id = user.Id, FacilityId = user.FacilityId };
    }

    public User ConvertFromAdminClientDto(UserFromAdminClientDto userDto)
    {
        return new() { Key = userDto.Key, Role = userDto.Role, Name = userDto.Name, ContactData = userDto.ContactData, FacilityId = userDto.FacilityId };
    }
    public User ConvertFromAdminClientDto(UserFromAdminClientDto userDto, User updateUser)
    {
        updateUser.Key = userDto.Key;
        updateUser.Role = userDto.Role;
        updateUser.Name = userDto.Name;
        updateUser.ContactData = userDto.ContactData;
        return updateUser;
    }

    public NotificationToClientDto ConvertNotification(Notification notification)
    {
        return new()
        {
            CreatedDate = notification.CreatedDate,
            Id = notification.Id,
            IsChecked = notification.IsChecked,
            Text = notification.Text,
            UserId = notification.UserId
        };
    }
}
