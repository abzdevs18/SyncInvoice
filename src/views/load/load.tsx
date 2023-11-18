import { CircularProgress, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useContext, useEffect, useState } from 'react'
import PageHeader from 'src/@core/components/page-header'
import Can, { AbilityContext } from 'src/layouts/components/acl/Can'

import SubjectLoad from 'src/views/load/subjects'
interface Post {
  id: number
  title: string
  content: string
  ownerId: number
  type: string
}
const TeacherSubjectLoad = ({ subj_data }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const ability = useContext(AbilityContext)

  const Post: Post = {
    id: 101,
    title: 'Alice’s Post',
    content: 'This is a post by Alice.',
    ownerId: 2160,
    type: 'Post' //Need this to set permissions
  }
  useEffect(() => {
    if (subj_data) {
      setIsLoading(false)
    }
  }, [subj_data])
  return (
    <Grid container spacing={6}>
      <PageHeader
        title={<Typography variant='h5'>My Advisories</Typography>}
        subtitle={<Typography variant='body2'>Below are the subjects you are currently handling</Typography>}
      />
      <Grid item xs={12}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <p>
              <Can do='delete' on={Post}>
                <button>Edisst</button>
              </Can>
              {Post.title} <br />-{ability?.can('update', Post) && <button>Edit</button>} <br />-
              {ability.can('delete', Post) && <button>Delete</button>}
            </p>
            {isLoading ? (
              <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <CircularProgress sx={{ mb: 4 }} />
                <Typography>Loading...</Typography>
              </Box>
            ) : (
              <SubjectLoad data={subj_data} />
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default TeacherSubjectLoad
