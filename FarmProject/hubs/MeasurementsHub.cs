using Microsoft.AspNetCore.SignalR;

namespace FarmProject.hubs;

public class MeasurementsHub : Hub
{
    public async Task AddPressureClientToGroup(string imei)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, GroupNameComposer.GetPressureGroup(imei));
    }
    public async Task RemovePressureClientFromGroup(string imei)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, GroupNameComposer.GetPressureGroup(imei));
    }

    public async Task AddUserToUsersGroup()
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, GroupNameComposer.GetUsersGroup());
    }
    public async Task RemoveUserFromUsersGroup()
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, GroupNameComposer.GetUsersGroup());
    }

}

public class GroupNameComposer
{
    private static string PRESSURE_GROUP_PREFIX = "pressure:";
    private static string USER_GROUP_PREFIX = "user:";

    public static string GetPressureGroup(string imei)
    {
        return $"{PRESSURE_GROUP_PREFIX}{imei}";
    }

    public static string GetUserGroup(int userId)
    {
        return $"{USER_GROUP_PREFIX}{userId}";
    }

    public static string GetUsersGroup()
    {
        return "users-group";
    }
}
