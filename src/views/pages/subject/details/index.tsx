// ** MUI Components
import Grid from '@mui/material/Grid'

// ** Demo Components
import ProjectsTable from 'src/views/pages/user-profile/profile/ProjectsTable'
import ActivityTimeline from 'src/views/pages/user-profile/profile/ActivityTimeline'

// ** Types
import PostedItem from 'src/views/apps/subject/component/PostedItem'
import AboutOverview from './AboutOverview'
import CreatePost from 'src/views/apps/subject/component/CreatePost'
import CalendarEvent from 'src/pages/components/CalendarEventSlider'
import { Box, Button, Card, CardContent, CardHeader, CircularProgress, IconButton, Typography } from '@mui/material'

import { useEffect, useState } from 'react'
import OptionsMenu from 'src/@core/components/option-menu'
import { Icon } from '@iconify/react'

const DetailsTab = ({ data, sectId, subjId }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [postData, setPostData] = useState([])

  const s_data = data.sections[0].profile
  const samplePost = {
    userAvatar: 'https://example.com/avatar.jpg', // URL to user's avatar
    userName: 'joh_doe',
    f_name: 'John Doe',
    date: 'September 30, 2023',
    content: 'This is a sample post content!'
  }

  useEffect(() => {
    fetch(`${process.env.BASE_URL}/api/social/post/postItems?sectionId=${sectId}`)
      .then(response => response.json())
      .then(data => {
        setPostData(data)
        setIsLoading(false)
        console.log(data[0])
      })
      .catch(error => {
        console.error('Error fetching students data:', error)
      })
  }, [sectId])

  return data && Object.values(data).length ? (
    <Grid container spacing={3}>
      <Grid item xl={3} md={3} xs={12}>
        <AboutOverview about={s_data.about} contacts={s_data.contacts} sectId={sectId} subjId={subjId} />
      </Grid>
      <Grid item xl={6} md={6} xs={12}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <CreatePost sectionId={sectId} />
            {isLoading ? (
              <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <CircularProgress sx={{ mb: 4 }} />
                <Typography>Loading...</Typography>
              </Box>
            ) : (
              <Box>
                {postData.map(post => {
                  if (post) {
                    return <PostedItem idx={post.id} post={post} setPostData={setPostData} postData={postData} />
                  }
                  return null
                })}
              </Box>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid item xl={3} md={3} xs={12}>
        <Card>
          <CardHeader
            title='Upcoming Events'
            sx={{ '& .MuiCardHeader-avatar': { mr: 2.5 } }}
            avatar={<Icon icon='mdi:format-list-bulleted' />}
            titleTypographyProps={{ sx: { color: 'text.primary' } }}
          />
          <CardContent>
            <CalendarEvent />
            <Button variant='contained' sx={{ mt: 4, mx: '0 auto', width: '100%' }} href='#'>
              View Calendar
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  ) : null
}

export default DetailsTab
