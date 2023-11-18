// ** Next Import
import { GetServerSideProps, InferGetServerSidePropsType } from 'next/types'

// Component
import SubjectList from 'src/views/apps/subject/view/SubjectList'

const SubjectSections = ({ gradeId }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <SubjectList gradeId={gradeId} />
}

export const getServerSideProps: GetServerSideProps = async context => {
  // Retrieve gradeId from context params //
  const gradeId = context.params?.gradeId

  if (!gradeId) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      gradeId: gradeId.toString()
    }
  }
}

export default SubjectSections
