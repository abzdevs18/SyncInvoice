// ** Next Import
import axios from 'axios'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next/types'

// ** Types
import { InvoiceType } from 'src/types/apps/invoiceTypes'
import SubjectDetails from 'src/views/apps/subject/SubjectDetails'

const SubjectDetailsTab = ({
  subjId,
  sectionId,
  tab,
  data
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <SubjectDetails subjId={subjId} sectionId={sectionId} tab={tab} data={data} />
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { subjId, sectionId, tab } = params
  try {
    const u_response = await axios.get(`${process.env.BASE_URL}/api/subject/details/${subjId}/section/${sectionId}`, {
      method: 'GET',
      headers: {
        Origin: `${process.env.BASE_ORIGIN}`
      }
    })

    return {
      props: {
        data: u_response.data, // This should ideally be the data specific to the subject and section combination
        subjId,
        sectionId,
        tab: params?.tab || 'details'
      }
    }
  } catch (error) {
    console.error('Failed to fetch data:', error)

    return {
      props: {
        data: [], // This should ideally be the data specific to the subject and section combination
        subjId,
        sectionId,
        tab: params?.tab || 'details'
      }
    }
  }
}

SubjectDetailsTab.acl = {
  subject: 'common-page',
  action: 'manage'
}

export default SubjectDetailsTab
