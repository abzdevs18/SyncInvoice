// components/CalendarComponent.js

import React from 'react'
import { Paper, Grid, Typography, Button } from '@mui/material'
import { styled } from '@emotion/react'

const CustomButton = styled(Button)`
  min-width: 40px;
  min-height: 40px;
  margin: 4px;
`

export default function CalendarComponent() {
  return (
    <Paper elevation={3} style={{ padding: '20px' }}>
      <Grid container direction='column' spacing={3}>
        <Grid item container justifyContent='space-between'>
          <Button>&lt;</Button>
          <Typography variant='h6'>Select Date</Typography>
          <Button>&gt;</Button>
        </Grid>
        <Grid item container justifyContent='space-between'>
          <Typography>APRIL</Typography>
          <Typography>MARCH</Typography>
        </Grid>
        <Grid item container>
          {/* Date Numbers */}
          {Array.from({ length: 7 }).map((_, index) => (
            <CustomButton key={index}>{index + 1}</CustomButton>
          ))}
        </Grid>
        <Grid item container>
          {/* Names & Dates */}
          {['Anderson, Cooper', 'Barry, Holly', 'Branson, Tom'].map((name, index) => (
            <Grid item key={index} xs={12} container>
              <Typography variant='body1' style={{ flex: 1 }}>
                {name}
              </Typography>
              {/* Date circles for each name */}
              {Array.from({ length: 7 }).map((_, idx) => (
                <CustomButton key={idx} variant='outlined'>
                  {/* You can conditionally render tick or cross or 'T' based on data */}
                </CustomButton>
              ))}
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Paper>
  )
}
