// import Grid from '@mui/material/Grid'
// import Typography from '@mui/material/Typography'
import axios from 'axios'
import { useContext } from 'react'
import AclGuard from 'src/@core/components/auth/AclGuard'
import { AbilityContext } from 'src/layouts/components/acl/Can'

// import PageHeader from 'src/@core/components/page-header'
// import user from 'src/store/apps/user'

import TeacherSubjectLoad from 'src/views/load/load'

type UserDataType = {
  user_data: string
}

const subjetLoad = ({ user_data }: UserDataType) => {
  const ability = useContext(AbilityContext)
  return <TeacherSubjectLoad subj_data={user_data} />
}

export async function getStaticProps() {
  const u_data = await axios.get('/pages/profile', { params: { tab: 'teams' } })

  // const u_data = await fetch(`${process.env.BASE_URL}/api/user`)
  const user_data = u_data.data

  // const user_data = await u_data.json()

  return {
    props: {
      user_data
    }
  }
}
subjetLoad.acl = {
  action: 'manage',
  subject: 'common-page'
}
export default subjetLoad
