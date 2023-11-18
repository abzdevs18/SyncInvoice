// ** Next Import
import { GetStaticProps, GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'

// ** Demo Components Imports
import SubjectDetails from 'src/views/load/preview/SubjectDetails'

const SubjectLoad = ({ data, id }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <SubjectDetails data={data} type={id} />
}

export const getStaticPaths: GetStaticPaths = async () => {
  const invoice_data = await fetch(`${process.env.BASE_URL}/api/invoice`)
  const res_invoice = await invoice_data.json()

  const paths = res_invoice.map((invoice: any) => ({
    params: {
      id: invoice.id.toString()
    }
  }))

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext) => {
  if (!params || !params.id) {
    // Handle the case when params or params.id is undefined or null Changing for test
    return {
      notFound: true // Return a 404 page or handle the error as desired
    }
  }
  const invoiceId = params.id
  const res = await fetch(`${process.env.BASE_URL}/api/invoice/${invoiceId}`)
  const subj = await res.json()

  return {
    props: {
      data: subj,
      type: typeof params.id,
      id: params.id
    }
  }
}

export default SubjectLoad
