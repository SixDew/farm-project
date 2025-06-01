using FarmProject.db.models;
using Microsoft.AspNetCore.Identity;

namespace FarmProject.dto.users.services;

public class UserDtoConverter(IServiceProvider _services)
{
    public UserToAdminClientDto ConvertToAdminClientDto(User user)
    {
        return new() { Key = user.Key, Role = user.Role, Name = user.Name, ContactData = user.ContactData, Id = user.Id, FacilityId = user.FacilityId };
    }

    public User ConvertFromAdminClientDto(UserFromAdminClientDto userDto)
    {
        using (var scope = _services.CreateScope())
        {
            var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher<User>>();
            User user = new User() { Key = userDto.Key, Role = userDto.Role, Name = userDto.Name, ContactData = userDto.ContactData, FacilityId = userDto.FacilityId };
            user.Key = passwordHasher.HashPassword(user, user.Key);
            return user;
        }
    }
    public User ConvertFromAdminClientDto(UserFromAdminClientDto userDto, User updateUser)
    {
        using (var scope = _services.CreateScope())
        {
            var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher<User>>();
            updateUser.Key = passwordHasher.HashPassword(updateUser, userDto.Key);
            updateUser.Role = userDto.Role;
            updateUser.Name = userDto.Name;
            updateUser.ContactData = userDto.ContactData;
            return updateUser;
        }
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
