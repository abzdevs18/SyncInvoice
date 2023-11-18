// ** Next Import
import { GetServerSideProps, InferGetServerSidePropsType } from 'next/types'

// ** Types
import { InvoiceType } from 'src/types/apps/invoiceTypes'

// ** Demo Components Imports
const SubjectSections = ({ gradeId }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return gradeId
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    // const res = await fetch(`${process.env.BASE_URL}/api/invoice`)
    // const invoiceData: InvoiceType[] = await res.json()
    // const u_response = await fetch(`${process.env.BASE_URL}/api/user/${params.userId}/data`, {
    //   method: 'GET',
    //   headers: {
    //     Origin: 'http://localhost:3000'
    //   }
    // })
    // const userData = await u_response.json()

    return {
      props: {
        // invoiceData,
        // tab: params?.tab || 'overview',
        // userData: userData.data,
        gradeId: params.gradeId
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

export default SubjectSections
