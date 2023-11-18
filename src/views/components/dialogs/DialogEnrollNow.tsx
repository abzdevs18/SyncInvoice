// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import Icon from 'src/@core/components/icon'
import { FormControl, Grid, Link, TextField, Typography } from '@mui/material'
import { Controller } from 'react-hook-form'

const DialogEnrollNow = ({ styled }: { styled: boolean }) => {
  // ** State
  const [open, setOpen] = useState<boolean>(false)
  const [showStudentIdField, setShowStudentIdField] = useState<boolean>(false)
  const [studentId, setStudentId] = useState<string>('')

  const handleClickOpen = () => setOpen(true)

  const handleClose = () => {
    if (showStudentIdField) {
      // Handle redirection here if needed
      // For example, you can use window.location.href = '/application';
    } else {
      setOpen(false)
    }
  }
  const handleYesClick = () => {
    setShowStudentIdField(true)
  }

  const handleBackClick = () => {
    setShowStudentIdField(false)
  }

  const handleStudentIdChange = event => {
    const { value } = event.target
    setStudentId(value)
  }

  return (
    <Fragment>
      {styled && (
        <Button
          variant='contained'
          onClick={handleClickOpen}
          startIcon={<Icon icon='mdi:account-cowboy-hat' />}
          sx={{
            backgroundColor: '#282A42',
            color: '#fff',
            textTransform: 'capitalize'
          }}
        >
          Enroll Now
        </Button>
      )}
      {!styled && (
        <Typography
          onClick={handleClickOpen}
          component={Link}
          sx={{ color: 'primary.main', textDecoration: 'none', cursor: 'pointer' }}
        >
          Submit Application
        </Typography>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Are you an Old Student?</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Before we proceed, please confirm if you're a returning student. If so, we can retrieve your data from our
            database, making your experience smoother.
          </DialogContentText>

          {showStudentIdField && (
            <Grid className={`studentId ${showStudentIdField ? 'slide-in' : ''}`} item xs={12} sm={12} mt={4}>
              <TextField
                fullWidth
                type='text'
                label='Student ID'
                placeholder='ESTUD2'
                onChange={handleStudentIdChange}
                value={studentId}
              />
            </Grid>
          )}
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          {!showStudentIdField && (
            <Fragment>
              <Button href='/application'>No</Button>
              <Button onClick={handleYesClick}>Yes</Button>
            </Fragment>
          )}
          {showStudentIdField && (
            <Fragment>
              <Button onClick={handleBackClick}>Back</Button>
              <Button href={`/application?studentId=${studentId}`}>Proceed</Button>
            </Fragment>
          )}
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default DialogEnrollNow
