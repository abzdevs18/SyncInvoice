// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): HorizontalNavItemsType => {
  return [
    {
      icon: 'mdi:home-outline',
      title: 'Home',
      path: '/dashboards',
      subject: 'common-page',
      action: 'manage'
    },
    {
      title: 'Chat',
      icon: 'mdi:message-outline',
      path: '/apps/chat',
      subject: 'chat-page',
      action: 'manage'
    },
    {
      title: 'Subject',
      icon: 'mdi:account-details-outline',
      path: '/load',
      subject: 'subject-page',
      action: 'manage'
    },
    {
      title: 'Report Card',
      icon: 'mdi:message-outline',
      path: '/apps/report-card',
      subject: 'report-card-page',
      action: 'manage'
    },
    {
      title: 'Invoice',
      icon: 'mdi:file-document-outline',
      path: '/apps/invoice',
      subject: 'invoice-page',
      action: 'manage'
    },
    {
      title: 'QR Scanner',
      action: 'manage',
      subject: 'qr-page',
      icon: 'mdi:account-outline',
      path: '/qr'
    },
    {
      title: 'Calendar',
      icon: 'mdi:calendar',
      action: 'manage',
      subject: 'calendar-page',
      path: '/apps/calendar/'
    },
    {
      title: 'Help Center',
      icon: 'mdi:help-circle-outline',
      path: '/pages/help-center',
      subject: 'common-page',
      action: 'manage'
    }
  ]
}

export default navigation
