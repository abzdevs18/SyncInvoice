// ** React Imports
import { useState, MouseEvent, useRef, useEffect, forwardRef, ChangeEvent } from 'react'
import { useForm, Controller } from 'react-hook-form'

import axios from 'axios'

// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

import { DateType } from 'src/types/forms/reactDatepickerTypes'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Divider, FormHelperText, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import DatePicker from 'react-datepicker'

const axiosInstance = axios.create({
  baseURL: process.env.BASE_URL, // Replace with your API base URL
  withCredentials: true // Include this if your requests need to send cookies or authentication headers
})
const headers = {
  'Content-Type': 'application/json'
}
interface FormInputs {
  firstName: string
}

const defaultValues = {
  firstName: ''
}

// const {
//   control,
//   formState: { errors }
// } = useForm<FormInputs>({ defaultValues })

interface CustomInputProps {
  value: DateType
  label: string
  error: boolean
}

const CustomInput = forwardRef((props, ref) => {
  return <TextField fullWidth {...props} inputRef={ref} label='Birth Date' autoComplete='off' />
})

// const CustomInput = forwardRef(({ ...props }: CustomInputProps, ref) => {
//   return <TextField inputRef={ref} {...props} sx={{ width: '100%' }} />
// })

const StudentStepAccountDetails = ({ handleNext }: { handleNext: () => void }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    gender: ''
  })
  const [serverData, setServerData] = useState(null)
  const formRef = useRef(null)
  const [date, setDate] = useState<DateType>(null)
  const [language, setLanguage] = useState<string[]>([])

  useEffect(() => {
    const currentUrl = new URL(window.location.href)
    const studentId = 'studentId'
    const params = new URLSearchParams(currentUrl.search)
    const studentId_param = params.get(studentId)
    if (!studentId_param) {
      const storedFormData = localStorage.getItem('formData')
      if (storedFormData) {
        setFormData(JSON.parse(storedFormData))
      }
    } else {
      console.log('Student:', studentId_param)
    }
  }, [])

  const handleSubmit = (event: MouseEvent<HTMLFormElement>) => {
    event.preventDefault()

    const storedNewStudentId = localStorage.getItem('newStudentId')
    if (storedNewStudentId) {
      axiosInstance
        .post(`${process.env.BASE_URL}/api/student/${storedNewStudentId}/update`, formData, {
          headers
        })
        .then(response => {
          setServerData(response.data)
          localStorage.setItem('formData', JSON.stringify(formData))
          handleNext()

          // localStorage.setItem('newStudentId', newStudentId)
        })
        .catch(error => {
          console.log(error)
        })
    } else {
      axiosInstance
        .post(`${process.env.BASE_URL}/api/student/create`, formData, {
          headers
        })
        .then(response => {
          // handle response
          console.log(response)
          const { newStudentId } = response.data
          setServerData(response.data)
          localStorage.setItem('formData', JSON.stringify(formData))
          localStorage.setItem('newStudentId', newStudentId)
          handleNext()
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }

  // Handle Select
  const handleSelectChange = (event: SelectChangeEvent<string[]>) => {
    setLanguage(event.target.value as string[])
  }

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant='h5'>Student Information</Typography>
        <Typography sx={{ color: 'text.secondary' }}>Enter Your Account Details</Typography>
      </Box>

      <form onSubmit={handleSubmit} ref={formRef}>
        <DatePickerWrapper>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Divider sx={{ mb: '0 !important' }} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                Account Info
              </Typography>
            </Grid>
            {/* <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <Controller
                  name='firstName'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='First Name'
                      onChange={onChange}
                      placeholder='Leonard'
                      error={Boolean(errors.firstName)}
                      aria-describedby='validation-basic-first-name'
                    />
                  )}
                />
                {errors.firstName && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid> */}
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <TextField
                  label='First Name'
                  placeholder='Cena'
                  name='firstName'
                  value={formData?.firstName}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <TextField
                  label='Middle Name'
                  placeholder='Cena'
                  name='middleName'
                  value={formData?.middleName}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <TextField
                  label='Last Name'
                  placeholder='Doe'
                  name='lastName'
                  value={formData?.lastName}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
              <FormControl fullWidth>
                <InputLabel id='Gender-select'>Gender</InputLabel>
                <Select
                  labelId='Gender-select'
                  label='Gender'
                  defaultValue='Male'
                  name='gender'
                  value={formData?.gender}
                  onChange={handleChange}
                >
                  <MenuItem value='Male'>Male</MenuItem>
                  <MenuItem value='Female'>Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={5}>
              <DatePicker
                selected={date}
                showYearDropdown
                showMonthDropdown
                placeholderText='MM-DD-YYYY'
                customInput={<CustomInput />}
                id='form-layouts-separator-date'
                onChange={(date: Date) => setDate(date)}
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>Nationality</InputLabel>
                <Select
                  label='Country'
                  defaultValue=''
                  id='form-layouts-separator-select'
                  labelId='form-layouts-separator-select-label'
                >
                  <MenuItem value='Filipino'>Filipino</MenuItem>
                  <MenuItem value='French'>French</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField label='Place of Birth' name='pob' placeholder='7777, Mendez Plains, Florida' />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ mb: '0 !important' }} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                Contact Info
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Mobile'
                placeholder='963 864 7824'
                InputProps={{
                  startAdornment: <InputAdornment position='start'>PH (+63)</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type='number' label='Zipcode' placeholder='6200' />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField label='Address' placeholder='7777, Mendez Plains, Florida' />
              </FormControl>
            </Grid>
            {/* <Grid item xs={12}>
              <TextField fullWidth label='Landmark' placeholder='Mendez Plains' />
            </Grid> */}
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label='City' placeholder='Miami' />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='state-select'>Province</InputLabel>
                <Select labelId='state-select' label='State' defaultValue='Negros Oriental'>
                  <MenuItem value='Negros Oriental'>Negros Oriental</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button disabled variant='contained' startIcon={<Icon icon='mdi:chevron-left' fontSize={20} />}>
                  Previous
                </Button>
                <Button variant='contained' type='submit' endIcon={<Icon icon='mdi:chevron-right' fontSize={20} />}>
                  Next
                </Button>
              </Box>
            </Grid>
          </Grid>
        </DatePickerWrapper>
      </form>
    </>
  )
}

export default StudentStepAccountDetails
