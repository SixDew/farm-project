using FarmProject.group_feature;
using FarmProject.group_feature.group;
using FarmProject.group_feature.section;

namespace FarmProject.dto.groups.services
{
    public class FacilityConverter(GroupConverter _groupConverter, SectionConverter _sectionConverter)
    {
        public FacilityToClientDto ConvertToClient(Facility facility)
        {
            return new FacilityToClientDto()
            {
                Name = facility.Name,
                Groups = facility.Groups.Select(_groupConverter.ConvertToClient).ToList(),
                Sections = facility.Sections.Select(_sectionConverter.ConvertToClientDto).ToList(),
                Id = facility.Id,
            };
        }

        public FacilityMainDataToClientDto ConvertMainDataToClient(Facility facility)
        {
            return new()
            {
                AdditionalData = facility.AdditionalData,
                Adress = facility.Adress,
                ContactData = facility.ContactData,
                Id = facility.Id,
                Inn = facility.Inn,
                Name = facility.Name,
                Ogrn = facility.Ogrn,
                RegistrationDate = facility.RegistrationDate
            };
        }

        public Facility UpdateFacility(Facility facilityToUpdate, MainDataFacilityDto data)
        {
            facilityToUpdate.Name = data.Name;
            facilityToUpdate.Inn = data.INN;
            facilityToUpdate.Ogrn = data.OGRN;
            facilityToUpdate.Adress = data.Adress;
            facilityToUpdate.RegistrationDate = data.RegistrationDate;
            facilityToUpdate.ContactData = data.ContactData;
            facilityToUpdate.AdditionalData = data.AdditionalData;
            return facilityToUpdate;
        }

        public Facility ConvertFrom(AddFacilityDto data)
        {
            return new()
            {
                Inn = data.Inn,
                Name = data.Name,
                Ogrn = data.Ogrn,
                Adress = data.Adress,
                RegistrationDate = data.RegistrationDate,
                ContactData = data.ContactData,
                AdditionalData = data.AdditionalData,
                Sections = data.Sections.Select(s => new Section() { Name = s }).ToList(),
                Groups = data.Groups.Select(g => new SensorGroup() { Name = g }).ToList()
            };
        }

        public FacilityDeepMetaToClientDto ConvertToClientMeta(Facility facility)
        {
            return new FacilityDeepMetaToClientDto()
            {
                Name = facility.Name,
                Sections = facility.Sections.Select(_sectionConverter.ConvertToMetadata).ToList(),
                Groups = facility.Groups.Select(_groupConverter.ConvertToMetadata).ToList(),
                Id = facility.Id,
            };
        }
    }
}
