import { useState, ReactNode } from 'react'

// ** Layout Import
import axios from 'axios'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import React, { useEffect } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { Avatar, Box, Button, Card, CardContent, CardHeader, Grid, IconButton, Typography } from '@mui/material'
import CardSnippet from 'src/@core/components/card-snippet'
import ToastCustom from 'src/views/components/toast/ToastCustom'
import toast from 'react-hot-toast'
import CalendarEvent from 'src/pages/components/CalendarEventSlider'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import StudentLogTimeline from 'src/views/components/qr/StudentLogTimeline'

const Scan = props => {
  let scanText = ''
  let html5QrcodeScanner
  useEffect(() => {
    html5QrcodeScanner = new Html5QrcodeScanner(
      'reader',
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    )
    html5QrcodeScanner.render(onScanSuccess, onScanFailure)
  }, [])

  function onScanSuccess(decodedText, decodedResult) {
    if (decodedText != scanText) {
      let toastMsg = 'SMS to parent sent ahead, all good!'
      const data = {
        code: decodedText
      }
      scanText = decodedText
      axios
        .post(`${process.env.BASE_URL}/api/student/log`, data)
        .then(response => {
          const status = response.data.status
          if (status == 'am_early') {
            toastMsg = 'Wow, ahead of its time!'
          } else if (status == 'am_late') {
            toastMsg = 'Hey there! Arriving late for class?'
          } else if (status == 'pm_early') {
            toastMsg = "Stay for the fun, school's not done!"
          } else if (status == 'pm_late') {
            toastMsg = 'Time to head home, see you!'
          } else if (status == 'sent') {
            toastMsg = 'Nice Try! HAHAHA'
          }
          toastAccountIfo(response.data.user, toastMsg)
          console.log('Code:::', response.data.user.f_name, response.data.user.l_name)
        })
        .catch(error => {
          console.log(error)
        })
      beep()
    }
  }
  function onScanFailure(errorMessage) {
    // handle on error condition, with error message
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
  const toastAccountIfo = (student, toastMsg) => {
    return toast(
      t => (
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              alt='Victor Anderson'
              src='/images/avatars/7.png'
              sx={{ mr: 3, width: 40, height: 40 }}
              variant='rounded'
            />
            <div>
              <Typography sx={{ fontWeight: 500 }}>
                {student.f_name} {student.l_name}
              </Typography>
              <Typography variant='caption'>{toastMsg}</Typography>
            </div>
          </Box>
          <IconButton onClick={() => toast.dismiss(t.id)}>
            <Icon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Box>
      ),
      {
        style: {
          minWidth: '300px'
        }
      }
    )
  }

  return (
    <Grid container spacing={4}>
      <Grid
        item
        xl={3}
        md={3}
        xs={12}
        sx={{
          order: {
            xs: 1,
            lg: 1
          }
        }}
      >
        <StudentLogTimeline />
      </Grid>
      <Grid
        item
        xl={6}
        md={6}
        xs={12}
        sx={{
          order: {
            xs: 3,
            lg: 2
          }
        }}
      >
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                width: '100%',
                margin: '0 auto',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0px'
              }}
            >
              <div style={{ width: '100%' }} id='reader'></div>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        item
        xl={3}
        md={3}
        xs={12}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          order: {
            xs: 2,
            lg: 3
          }
        }}
      >
        <Card>
          <CardHeader
            title='Student Preview'
            sx={{ '& .MuiCardHeader-avatar': { mr: 2.5 } }}
            avatar={<Icon icon='mdi:format-list-bulleted' />}
            titleTypographyProps={{ sx: { color: 'text.primary' } }}
          />
          <CardContent>
            <Card sx={{ position: 'relative', backgroundColor: 'primary.main' }}>
              <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
                <img src='/images/avatars/1.png' alt='' style={{ width: '100%', borderRadius: '10px' }} />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <Typography sx={{ fontWeight: 'bold', color: '#fff', fontSize: '18px' }}>John Doe</Typography>
                  <Typography sx={{ color: '#fff', fontSize: '14px' }}>Grade IV</Typography>
                </Box>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
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
  )
}

Scan.contentHeightFixed = true

Scan.acl = {
  subject: 'qr-page',
  action: 'manage'
}

export default Scan
