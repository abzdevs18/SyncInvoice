// ** React Imports
import { ReactNode } from 'react'

// ** MUI Components
import Box, { BoxProps } from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Demo Components Imports
import RegisterMultiStepsWizard from 'src/views/pages/auth/register-multi-steps'
import StudentRegisterMultiSteps from 'src/views/pages/student-application'

// ** Styled Components
const RegisterMultiStepsIllustration = styled('img')({
  maxWidth: 200,
  height: 'auto',
  maxHeight: '100%'
})

const LeftWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(12),
  [theme.breakpoints.up('lg')]: {
    maxWidth: 480
  },
  [theme.breakpoints.down(1285)]: {
    maxWidth: 400
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 635
  }
}))

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(6),
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(12)
  }
}))

const WizardWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  maxWidth: 700,
  margin: theme.spacing(0, 'auto'),
  [theme.breakpoints.up('md')]: {
    width: 700
  }
}))

const StudentApplication = () => {
  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('lg'))

  // ** Var
  const { skin } = settings

  return (
    <Box className='content-right'>
      {!hidden ? (
        <LeftWrapper>
          <Box
            sx={{
              top: 30,
              left: 25,
              display: 'flex',
              position: 'absolute',
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
          <RegisterMultiStepsIllustration
            alt='register-multi-steps-illustration'
            src='/images/pages/auth-v2-register-multi-steps-illustration.png'
          />
        </LeftWrapper>
      ) : null}
      <RightWrapper sx={skin === 'bordered' && !hidden ? { borderLeft: `1px solid ${theme.palette.divider}` } : {}}>
        <Box
          sx={{
            top: 30,
            left: 25,
            display: 'flex',
            position: 'absolute',
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
        <WizardWrapper maxWidth={900}>
          <StudentRegisterMultiSteps />
        </WizardWrapper>
      </RightWrapper>
    </Box>
  )
}

StudentApplication.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

StudentApplication.guestGuard = true

export default StudentApplication
