using FarmProject.db.services.providers;

namespace FarmProject.auth
{
    public class UserAccessService(UserProvider _users, FacilityProvider _facilities)
    {
        public async Task<bool> CheckFacilityAffiliation(int userId, int facilityId)
        {
            var user = await _users.GetAsync(userId);
            return !(user is null || user.FacilityId != facilityId);
        }
    }
}
