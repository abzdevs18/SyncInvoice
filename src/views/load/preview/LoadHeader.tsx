// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import axios from 'axios'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { ProfileHeaderType } from 'src/@fake-db/types'

const ProfilePicture = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: theme.shape.borderRadius,
  border: `5px solid ${theme.palette.common.white}`,
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  }
}))

const SubjectLoadHeader = () => {
  // ** State
  const [data, setData] = useState<ProfileHeaderType | null>(null)

  useEffect(() => {
    axios.get('/pages/profile-header').then(response => {
      setData(response.data)
    })
  }, [])

  // const designationIcon = data?.designationIcon || 'mdi:briefcase-outline'

  return data !== null ? (
    <Card>
      <CardMedia
        component='img'
        alt='profile-header'
        image={data.coverImg}
        sx={{
          height: { xs: 150, md: 250 }
        }}
      />
      <CardContent
        sx={{
          pt: 0,
          mt: -8,
          display: 'flex',
          alignItems: 'flex-end',
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          justifyContent: { xs: 'center', md: 'flex-start' }
        }}
      >
        <ProfilePicture src={data.profileImg} alt='profile-picture' />
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            ml: { xs: 0, md: 6 },
            alignItems: 'flex-end',
            flexWrap: ['wrap', 'nowrap'],
            justifyContent: ['center', 'space-between']
          }}
        >
          <Box sx={{ mb: [6, 0], display: 'flex', flexDirection: 'column', alignItems: ['center', 'flex-start'] }}>
            <Typography variant='h5' sx={{ mb: 2, fontSize: '1.375rem' }}>
              Mathematics
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: ['center', 'flex-start']
              }}
            >
              <Typography sx={{ color: 'text.disabled' }}>
                Support your team. Your customer support team is fielding the good, the bad, and the ugly day in and day
                out.
              </Typography>
            </Box>
          </Box>
          <Button variant='contained' startIcon={<Icon icon='mdi:account-check-outline' fontSize={20} />}>
            Post
          </Button>
        </Box>
      </CardContent>
    </Card>
  ) : null
}

export default SubjectLoadHeader
