import {create} from 'zustand'
import {persist} from 'zustand/middleware'

export type GroupData = {
    groupId:number,
    isVisible:boolean
}

export type SectionData = {
    groups:GroupData[],
    sectionId:number,
    isVisible:boolean
}

type FacilityGroups = {
    facilityId:number,
    groups:GroupData[],
}

type FacilitySections = {
    facilityId:number,
    sections:SectionData[]
}

export type GroupStore = {
    groupsData:FacilityGroups[],
    sectionsData:FacilitySections[],
    setGroups:(items:GroupData[], facilityId:number) => void,
    getGroups:(facilityId:number) => GroupData[] | undefined,
    setSections:(items:SectionData[], facilityId:number) => void,
    getSections:(facilityId:number) => SectionData[] | undefined
}


export const useGroupStore = create<GroupStore>()(
    persist(
        (set, get) => ({
            groupsData:[],
            sectionsData:[],
            setGroups:(items:GroupData[], facilityId:number)=>{
                var store = get()
                var groups = store.groupsData.find(f=>f.facilityId == facilityId)
                if(groups) groups.groups = items
                else store.groupsData.push({facilityId:facilityId, groups:items})
                set({...store})
            },
            getGroups:(facilityId:number)=>{
                var store = get()
                return store.groupsData.find(gd=>gd.facilityId == facilityId)?.groups
            },
            setSections:(items:SectionData[], facilityId:number)=>{
                var store = get()
                var sections = store.sectionsData.find(f=>f.facilityId == facilityId)
                if(sections) sections.sections = items
                else store.sectionsData.push({facilityId:facilityId, sections:items})
                set({...store})
            },
            getSections:(facilityId:number)=>{
                var store = get()
                return store.sectionsData.find(sd=>sd.facilityId == facilityId)?.sections
            }
        }),
        {
            name:"group-store"
        }
    )
)