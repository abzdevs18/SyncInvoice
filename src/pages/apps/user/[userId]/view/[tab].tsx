// ** Next Import
import { GetServerSideProps, InferGetServerSidePropsType } from 'next/types'

// ** Types
import { InvoiceType } from 'src/types/apps/invoiceTypes'

// ** Demo Components Imports
import UserViewPage from 'src/views/apps/user/view/UserViewPage'

const UserView = ({ tab, invoiceData, userData }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <UserViewPage tab={tab} invoiceData={invoiceData} userData={userData} />
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const res = await fetch(`${process.env.BASE_URL}/api/invoice`)
    const invoiceData: InvoiceType[] = await res.json()
    const u_response = await fetch(`${process.env.BASE_URL}/api/user/${params.userId}/data`, {
      method: 'GET',
      headers: {
        Origin: `${process.env.BASE_ORIGIN}`
      }
    })
    const userData = await u_response.json()

    return {
      props: {
        invoiceData,
        tab: params?.tab || 'overview',
        userData: userData.data
      }
    }
  } catch (error) {
    console.error('Failed to fetch data:', error)

    return {
      props: {
        invoiceData: [],
        tab: 'overview',
        userData: []
      }
    }
  }
}

UserView.acl = {
  action: 'manage',
  subject: 'quickview-profile-page'
}
export default UserView
