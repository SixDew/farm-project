using FarmProject.db.models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace FarmProject.dto.users.services;

public class UserDtoConverter(IServiceProvider _services)
{
    public UserToAdminClientDto ConvertToAdminClientDto(User user)
    {
        return new()
        {
            Role = user.Role,
            Name = user.Name,
            ContactData = user.ContactData,
            Login = user.Login,
            Id = user.Id,
            FacilityId = (int)user.FacilityId,
            PersonnelNumber = user.PersonnelNumber
        };
    }

    public User ConvertFromAdminClientDto(UserFromAdminClientDto userDto)
    {
        using (var scope = _services.CreateScope())
        {
            var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher<User>>();
            User user = new User()
            {
                Key = userDto.Key,
                Login = userDto.Login,
                Role = userDto.Role,
                Name = userDto.Name,
                ContactData = userDto.ContactData,
                FacilityId = userDto.FacilityId,
                PersonnelNumber = userDto.PersonnelNumber
            };
            user.Key = passwordHasher.HashPassword(user, user.Key);
            return user;
        }
    }
    public User ConvertFromAdminClientDto(UserFromAdminClientDto userDto, User updateUser)
    {
        using (var scope = _services.CreateScope())
        {
            var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher<User>>();
            if (!userDto.Key.IsNullOrEmpty()) updateUser.Key = passwordHasher.HashPassword(updateUser, userDto.Key);
            updateUser.Role = userDto.Role;
            updateUser.Login = userDto.Login;
            updateUser.Name = userDto.Name;
            updateUser.ContactData = userDto.ContactData;
            updateUser.PersonnelNumber = userDto.PersonnelNumber;
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
