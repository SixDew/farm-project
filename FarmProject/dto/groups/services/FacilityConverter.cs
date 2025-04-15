using FarmProject.group_feature;

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
