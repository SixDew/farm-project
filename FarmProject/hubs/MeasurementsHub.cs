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
}

public class GroupNameComposer
{
    private static string PRESSURE_GROUP_PREFIX = "pressure:";

    public static string GetPressureGroup(string imei)
    {
        return $"{PRESSURE_GROUP_PREFIX}{imei}";
    }
}
