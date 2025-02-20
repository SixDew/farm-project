using FarmProject.db.models;

namespace FarmProject.dto.users.services;

public class UserDtoConverter
{
    public UserToAdminClientDto ConvertToAdminClientDto(User user)
    {
        return new() { Key = user.Key, Role = user.Role, Name = user.Name, Phone = user.Phone };
    }

    public User ConvertFromAdminClientDto(UserFromAdminClientDto userDto)
    {
        return new() { Key = userDto.Key, Role = userDto.Role, Name = userDto.Name, Phone = userDto.Phone };
    }
    public User ConvertFromAdminClientDto(UserFromAdminClientDto userDto, User updateUser)
    {
        updateUser.Key = userDto.Key;
        updateUser.Role = userDto.Role;
        updateUser.Name = userDto.Name;
        updateUser.Phone = userDto.Phone;
        return updateUser;
    }
}
