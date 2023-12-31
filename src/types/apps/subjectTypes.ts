// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

export type SubjectsType = {
  id: number
  name: string
  subjectTrack: string
  track: string
  classification: string
  gradeLevel: string
  semester: string
  strand: string
  teachers: []
  teacherAvatars: []
  sections: []
}

export type ProjectListDataType = {
  id: number
  img: string
  hours: string
  totalTask: string
  projectType: string
  projectTitle: string
  progressValue: number
  progressColor: ThemeColor
}

export type ProjectTableRowType = {
  id: number
  date: string
  name: string
  leader: string
  status: number
  avatar?: string
  avatarGroup: string[]
  avatarColor?: ThemeColor
}
export type ProfileHeaderType = {
  fullName: string
  coverImg: string
  location: string
  profileImg: string
  joiningDate: string
  designation: string
  designationIcon?: string
}
export type ProfileAvatarGroupType = {
  name: string
  avatar: string
}
export type ProfileChipType = {
  title: string
  color: ThemeColor
}
export type ProfileTabCommonType = {
  icon: string
  value: string
  property: string
}
export type ProfileTeamsType = ProfileTabCommonType & { color: ThemeColor }
export type ProfileConnectionsType = {
  name: string
  avatar: string
  isFriend: boolean
  connections: string
}
export type ProfileTeamsTechType = {
  title: string
  avatar: string
  members: number
  chipText: string
  ChipColor: ThemeColor
}
export type TeamsTabType = {
  title: string
  avatar: string
  description: string
  extraMembers: number
  chips: ProfileChipType[]
  avatarGroup: ProfileAvatarGroupType[]
}
export type ProjectsTabType = {
  hours: string
  tasks: string
  title: string
  budget: string
  client: string
  avatar: string
  members: string
  daysLeft: number
  comments: number
  deadline: string
  startDate: string
  totalTask: number
  budgetSpent: string
  description: string
  chipColor: ThemeColor
  completedTask: number
  avatarColor?: ThemeColor
  avatarGroup: ProfileAvatarGroupType[]
}
export type ConnectionsTabType = {
  name: string
  tasks: string
  avatar: string
  projects: string
  connections: string
  designation: string
  isConnected: boolean
  chips: ProfileChipType[]
}
export type SubjectTabType = {
  details: ProfileTeamsType[]
  student: ProfileTabCommonType[]
  team: ProfileTabCommonType[]
}
export type SubjectDetailsActiveTab = SubjectTabType | TeamsTabType[] | ProjectsTabType[] | ConnectionsTabType[]
