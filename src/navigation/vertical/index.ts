// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboard',
      icon: 'mdi:home-outline',
      path: '/'
    },
    {
      sectionTitle: 'Menu & Pages'
    },
    {
      title: 'Users',
      icon: 'mdi:account-outline',
      path: '/admin/users/list'
    },
    {
      title: 'Subjects',
      icon: 'mdi:file-document-outline',
      action: 'manage',
      subject: 'subject-page',
      path: '/admin/subject/list'
    },
    {
      title: 'Grade Levels',
      icon: 'mdi:file-document-outline',
      action: 'manage',
      subject: 'subject-page',
      path: '/'
    },
    {
      title: 'Calendar',
      icon: 'mdi:calendar',
      action: 'manage',
      subject: 'calendar-page',
      path: '/apps/calendar/'
    },
    {
      title: 'Subject Load',
      icon: 'mdi:account-details-outline',
      path: '/load'
    },
    {
      title: 'Chat',
      icon: 'mdi:message-outline',
      path: '/apps/chat'
    },
    {
      title: 'Invoice',
      icon: 'mdi:file-document-outline',
      path: '/apps/invoice/list'
    },
    {
      title: 'QR Scanner',
      action: 'manage',
      subject: 'qr-page',
      icon: 'mdi:account-outline',
      path: '/qr'
    },
    {
      sectionTitle: 'Security'
    },
    {
      path: '/account-settings/account/',
      icon: 'mdi:cog-outline',
      title: 'Account Settings'
    },
    {
      title: 'Roles',
      icon: 'mdi:shield-outline',
      path: '/apps/roles'
    },
    {
      title: 'Permissions',
      icon: 'mdi:shield-outline',
      path: '/apps/permissions'
    },
    {
      path: '/acl',
      action: 'delete',
      subject: 'acl-page',
      icon: 'mdi:shield-outline',
      title: 'Access Control'
    },
    {
      path: '/invoice',
      subject: 'invoice-page',
      icon: 'mdi:shield-outline',
      title: 'Invoice'
    },
    {
      title: 'User Profile',
      icon: 'mdi:account-outline',
      path: '/pages/user-profile/profile'
    }
  ]
}

export default navigation
