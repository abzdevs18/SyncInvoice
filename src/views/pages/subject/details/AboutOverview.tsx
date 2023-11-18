import React, { useEffect, useState } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { ProfileTeamsType, ProfileTabCommonType } from 'src/@fake-db/types'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { useContext } from 'react'
import { Avatar, Button, CardHeader, Collapse } from '@mui/material'
import DialogCheckAttendance from 'src/views/apps/subject/component/DialogCheckAttendance'

// ** MUI Imports
import Alert, { AlertColor } from '@mui/material/Alert'
import Slide from '@mui/material/Slide'
import IconButton from '@mui/material/IconButton'

// QR Code scanner
import { Html5QrcodeScanner } from 'html5-qrcode'
import axios from 'axios'
import toast from 'react-hot-toast'

interface Props {
  // teams: ProfileTeamsType[]
  about: ProfileTabCommonType[]
  contacts: ProfileTabCommonType[]
  overview: ProfileTabCommonType[]
  sectId: any
  subjId: any
}

const renderList = (arr: ProfileTabCommonType[]) => {
  if (arr && arr.length) {
    return arr.map((item, index) => {
      return (
        <Box
          key={index}
          sx={{
            display: 'flex',
            alignItems: 'center',
            '&:not(:last-of-type)': { mb: 4 },
            '& svg': { color: 'text.secondary' }
          }}
        >
          <Icon icon={item.icon} />

          <Typography sx={{ mx: 2, fontWeight: 600, color: 'text.secondary' }}>
            {`${item.property.charAt(0).toUpperCase() + item.property.slice(1)}:`}
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            {item.value.charAt(0).toUpperCase() + item.value.slice(1)}
          </Typography>
        </Box>
      )
    })
  } else {
    return null
  }
}

const AboutOverview = props => {
  const { about, contacts, sectId, subjId } = props
  const ability = useContext(AbilityContext)
  let scanText = ''
  let html5QrcodeScanner

  const [startScan, setStartScan] = useState(false)
  const [openScanner, setOpenScanner] = useState(false)
  const [open4, setOpen4] = useState<boolean>(false)
  const [severity, setSeverity] = useState<AlertColor>('error')
  const [qrMsg, setQrMsg] = useState('')

  const Post = {
    id: 101,
    title: 'Alice’s Post',
    content: 'This is a post by Alice.',
    ownerId: 2160
  }

  useEffect(() => {
    if (startScan) {
      html5QrcodeScanner = new Html5QrcodeScanner(
        'reader',
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      )
      html5QrcodeScanner.render(onScanSuccess, onScanFailure)
      setTimeout(() => setOpenScanner(true), 300)
    }
  }, [startScan])

  useEffect(() => {
    const handleStopClick = () => {
      setStartScan(false)
      setOpenScanner(false)
    }

    const observer = new MutationObserver((mutationsList, observer) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          const stopButton = document.querySelector('#html5-qrcode-button-camera-stop')
          if (stopButton) {
            stopButton.addEventListener('click', handleStopClick)
            observer.disconnect() // Disconnect the observer once the button is found and the listener is attached
          }
        }
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
    }
  }, [startScan])

  async function onScanSuccess(decodedText, decodedResult) {
    if (decodedText != scanText) {
      const currentDate = new Date()
      const formattedDate = currentDate.toISOString().split('T')[0]
      let toastMsg = 'SMS to parent sent ahead, all good!'
      const data = {
        username: decodedText,
        date: formattedDate,
        section: sectId,
        status: 'PRESENT'
      }
      scanText = decodedText
      await axios
        .post(`${process.env.BASE_URL}/api/subject/${subjId}/attendance/section/${sectId}/add`, data)
        .then(response => {
          setQrMsg('User not Found!')
          setSeverity('error')
          setOpen4(true)
          console.log(response.data)
        })
        .catch(error => {
          if (error.response) {
            setQrMsg(error.response.data.error)
            if (error.response.status == 404) {
              setSeverity('error')
            } else if (error.response.status == 403) {
              setSeverity('warning')
            }
          }

          setOpen4(true)
        })
      beep()
    }
  }
  function onScanFailure(errorMessage) {
    // console.log(errorMessage)
  }

  function beep() {
    const audioContext = new AudioContext()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.type = 'sine'
    oscillator.frequency.value = 1500
    gainNode.gain.value = 1

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.2)
  }
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ mb: 7 }}>
              <Typography variant='body2' sx={{ mb: 4, color: 'text.disabled', textTransform: 'uppercase' }}>
                About
              </Typography>
              {renderList(about)}
            </Box>
            <Box sx={{ mb: 7 }}>
              <Typography variant='body2' sx={{ mb: 4, color: 'text.disabled', textTransform: 'uppercase' }}>
                Teacher Contacts
              </Typography>
              {renderList(contacts)}
            </Box>
          </CardContent>
        </Card>
      </Grid>
      {ability?.can('manage', 'check-subject-attendance') ? (
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Automated Attendance' />
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  width: '100%',
                  margin: '0 auto',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  padding: '0px'
                }}
              >
                <Collapse in={openScanner}>
                  <div style={{ width: '500px' }} id='reader'></div>
                </Collapse>
                <Button
                  variant='contained'
                  startIcon={<Icon icon='mdi:camera' fontSize={20} />}
                  className={startScan ? 'fade-out scanHidden' : ''}
                  onClick={() => setStartScan(true)}
                >
                  Start Scanning
                </Button>
              </Box>
            </CardContent>
          </Card>
          <Collapse in={open4} sx={{ marginTop: 4 }}>
            <Alert
              action={
                <IconButton size='small' color='inherit' aria-label='close' onClick={() => setOpen4(false)}>
                  <Icon icon='mdi:close' fontSize='inherit' />
                </IconButton>
              }
              variant='filled'
              severity={severity}
            >
              {qrMsg}
            </Alert>
          </Collapse>
          <Box>
            {Post.title} <br />-{ability?.can('update', Post) && <button>Edit</button>} <br />-
            {ability.can('delete', Post) && <button>Delete</button>}
          </Box>
        </Grid>
      ) : null}
    </Grid>
  )
}

export default AboutOverview
