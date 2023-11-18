// ** React Imports
import { ReactNode, useEffect, useState } from 'react'
import CssBaseline from '@mui/material/CssBaseline'

import { format, Interval } from 'date-fns'

// ** Next Import
import { useRouter } from 'next/router'

// ** Spinner Import
import Spinner from 'src/@core/components/spinner'

// ** Hook Imports
import { useAuth } from 'src/hooks/useAuth'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { Box, Container, Grid, BoxProps, Tooltip, Card, CardContent } from '@mui/material'
import Icon from 'src/@core/components/icon'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'

import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography, { TypographyProps } from '@mui/material/Typography'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'
import DialogEnrollNow from 'src/views/components/dialogs/DialogEnrollNow'

// ** Configs
import themeConfig from 'src/configs/themeConfig'
import UseBgColor from 'src/@core/hooks/useBgColor'
import { useSettings } from 'src/@core/hooks/useSettings'
import { Controller } from 'react-hook-form'

// ** Styled Components
const LoginIllustrationWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  padding: theme.spacing(20),
  paddingRight: '0 !important',
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(10)
  }
}))

const LoginIllustration = styled('img')(({ theme }) => ({
  maxWidth: '48rem',
  [theme.breakpoints.down('xl')]: {
    maxWidth: '38rem'
  },
  [theme.breakpoints.down('lg')]: {
    maxWidth: '30rem'
  }
}))

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 400
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 450
  }
}))

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.down('md')]: {
    maxWidth: 400
  }
}))

const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  letterSpacing: '0.18px',
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { marginTop: theme.spacing(8) }
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const icons = ['mdi:account-cowboy-hat']

/**
 *  Set Home URL based on User Roles
 */
export const getHomeRoute = (role: string) => {
  if (role === 'Student') {
    return '/home'
  } else {
    return '/dashboards'
  }
}

const Home = () => {
  // ** Hooks
  const router = useRouter()
  const auth = useAuth()
  const theme = useTheme()
  const bgColors = UseBgColor()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // Clock
  const [currentTime, setCurrentTime] = useState(new Date())

  // ** Vars
  const { skin } = settings

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    if (auth.user && auth.user.role) {
      const homeRoute = getHomeRoute(auth.user.role)
      router.replace(homeRoute)
    }

    return () => clearInterval(intervalId)
  }, [])
  console.log('skajdfs')
  return (
    <Grid
      container
      height={'100vh'}
      sx={{
        background: '#63738100'
      }}
    >
      <CssBaseline />
      <Container
        maxWidth='xl'
        sx={{
          padding: '20px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Box
            sx={{
              top: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img src='/images/logo.png' alt='logo' width='47' height='47' />
            <Box sx={{ display: 'flex', alignItems: 'left', flexDirection: 'column' }}>
              <Typography variant='h6' sx={{ ml: 2, fontWeight: 700, lineHeight: 1.2 }}>
                {themeConfig.companyName}
              </Typography>
              <Typography sx={{ ml: 2, fontWeight: 500, lineHeight: 1.2, fontSize: 14 }}>
                {themeConfig.companySlogan}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <DialogEnrollNow styled={true} />
            <Button
              variant='contained'
              href='/login'
              startIcon={<Icon icon='mdi:account' />}
              sx={{
                backgroundColor: '#FA541C',
                color: '#fff',
                textTransform: 'capitalize'
              }}
            >
              Login
            </Button>
          </Box>
        </Box>
        <div>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box
              sx={{
                display: 'flex'
              }}
            >
              <Typography
                variant='h2'
                fontWeight={'bold'}
                sx={{
                  fontSize: '80px !important'
                }}
              >
                {format(currentTime, 'hh:mm')}
              </Typography>
              <Typography
                variant='h5'
                fontWeight={'bold'}
                sx={{
                  fontSize: '30px !important'
                }}
              >
                {format(currentTime, 'a')}
              </Typography>
            </Box>
            <Typography variant='h6'>{format(currentTime, 'MMMM d, yyyy')}</Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: '10px',
              marginTop: '30px'
            }}
          >
            <Grid alignContent={'baseline'}>
              <Tooltip arrow title='School Calendar' placement='top'>
                <Card>
                  <CardContent sx={{ display: 'flex', backgroundColor: '#FA541C' }}>
                    <Icon icon='mdi:calendar-blank-outline' color='#fff' />
                  </CardContent>
                </Card>
              </Tooltip>
            </Grid>
            <Grid alignContent={'baseline'}>
              <Tooltip arrow title='Test' placement='top'>
                <Card>
                  <CardContent sx={{ display: 'flex' }}>
                    <Icon icon='mdi:material-ui' />
                  </CardContent>
                </Card>
              </Tooltip>
            </Grid>
            <Grid alignContent={'baseline'}>
              <Tooltip arrow title='Test' placement='top'>
                <Card>
                  <CardContent sx={{ display: 'flex' }}>
                    <Icon icon='mdi:material-ui' />
                  </CardContent>
                </Card>
              </Tooltip>
            </Grid>
          </Box>
        </div>
        <div></div>
        <Box
          sx={{
            position: 'absolute',
            bottom: '0',
            right: '0'
          }}
        >
          <img src='/images/misc/upload.png' alt='' />
        </Box>
      </Container>
    </Grid>
  )
}
Home.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

Home.guestGuard = false
export default Home
