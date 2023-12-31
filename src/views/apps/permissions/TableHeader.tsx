// ** React Imports
import { FormEvent, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import FormControlLabel from '@mui/material/FormControlLabel'
import axios from 'axios'

interface TableHeaderProps {
  value: string
  handleFilter: (val: string) => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { value, handleFilter } = props

  // ** State
  const [open, setOpen] = useState<boolean>(false)

  const handleDialogToggle = () => setOpen(!open)

  const [formData, setFormData] = useState({
    permissionName: ''
  })

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${process.env.BASE_URL}/api/user/permission/create`, formData) // Replace with your API endpoint
      if (response.status === 200) {
        setOpen(false)
      }
    } catch (error) {
      // Handle Axios request error
      console.error('Error submitting signup form:', error)
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }

  return (
    <>
      <Box
        sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <TextField
          size='small'
          value={value}
          sx={{ mr: 4, mb: 2.5 }}
          placeholder='Search Permission'
          onChange={e => handleFilter(e.target.value)}
        />
        <Button sx={{ mb: 2.5 }} variant='contained' onClick={handleDialogToggle}>
          Add Permission
        </Button>
      </Box>
      <Dialog fullWidth maxWidth='sm' onClose={handleDialogToggle} open={open}>
        <DialogTitle sx={{ pt: 12, mx: 'auto', textAlign: 'center' }}>
          <Typography variant='h5' component='span' sx={{ mb: 2 }}>
            Add New Permission
          </Typography>
          <Typography variant='body2'>Permissions you may use and assign to your users.</Typography>
        </DialogTitle>
        <DialogContent sx={{ pb: 12, mx: 'auto' }}>
          <Box
            component='form'
            onSubmit={e => onSubmit(e)}
            sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <TextField
              fullWidth
              value={formData?.permissionName}
              onChange={handleChange}
              name='permissionName'
              label='Permission Name'
              sx={{ mb: 1, maxWidth: 360 }}
              placeholder='Enter Permission Name'
            />
            <FormControlLabel control={<Checkbox />} label='Set as core permission' />
            <Box className='demo-space-x' sx={{ '& > :last-child': { mr: '0 !important' } }}>
              <Button size='large' type='submit' variant='contained'>
                Create Permission
              </Button>
              <Button type='reset' size='large' variant='outlined' color='secondary' onClick={handleDialogToggle}>
                Discard
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default TableHeader
