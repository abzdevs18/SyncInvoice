// ** React Imports
import { useState, MouseEvent, useRef, useEffect, forwardRef, ChangeEvent } from 'react'
import { useForm, Controller } from 'react-hook-form'
import * as Yup from 'yup'

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
import FormLabel from '@mui/material/FormLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

import { DateType } from 'src/types/forms/reactDatepickerTypes'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import {
  Divider,
  FormHelperText,
  MenuItem,
  Select,
  SelectChangeEvent,
  FormControlLabel,
  Radio,
  RadioGroup
} from '@mui/material'
import DatePicker from 'react-datepicker'

const axiosInstance = axios.create({
  baseURL: process.env.BASE_URL, // Replace with your API base URL
  withCredentials: true // Include this if your requests need to send cookies or authentication headers
})
const headers = {
  'Content-Type': 'application/json'
}
interface FormInputs {
  dob: DateType
  vaccination_d1: DateType
  vaccination_d2: DateType
  email: string
  radio: string
  select: string
  gender: string
  nationality: string
  allergies: string
  treatment: string
  mobile: string
  booster: string
  password: string
  textarea: string
  checkbox: boolean
  f_name: string
  m_name: string
  l_name: string
}

interface CustomInputProps {
  value: DateType
  label: string
  error: boolean
  onChange: (event: ChangeEvent) => void
}

const defaultValues = {
  dob: null,
  email: '',
  radio: '',
  select: '',
  gender: '',
  lastName: '',
  password: '',
  textarea: '',
  f_name: '',
  m_name: '',
  l_name: '',
  checkbox: false
}

const CustomInput = forwardRef(({ ...props }: CustomInputProps, ref) => {
  return <TextField inputRef={ref} {...props} sx={{ width: '100%' }} />
})

const validationSchema = Yup.object().shape({
  mobile: Yup.string()
    .required('Mobile is required')
    .matches(/^\d{10}$/, 'Mobile must be 10 digits')
})

const StudentStepAccountDetails = ({ handleNext }: { handleNext: () => void }) => {
  const [formData, setFormData] = useState({
    f_name: '',
    l_name: '',
    m_name: '',
    gender: '',
    dob: '',
    nationality: '',
    placeofbirth: ''
  })
  const [serverData, setServerData] = useState(null)
  const formRef = useRef(null)
  const [date, setDate] = useState<DateType>(null)
  const [language, setLanguage] = useState<string[]>([])
  const [vaccinated, setVaccinated] = useState(null)
  const [showSecondDose, setShowSecondDose] = useState(false)
  let studentId_param = ''

  useEffect(() => {
    const currentUrl = new URL(window.location.href)
    const studentId = 'studentId'
    const params = new URLSearchParams(currentUrl.search)
    studentId_param = params.get(studentId)

    if (!studentId_param) {
      const storedFormData = localStorage.getItem('formData')
      if (storedFormData) {
        setFormData(JSON.parse(storedFormData))
      }
    } else {
      axiosInstance
        .post(`${process.env.BASE_URL}/api/student/${studentId_param}/update`, formData, {
          headers
        })
        .then(response => {
          localStorage.setItem('formData', JSON.stringify(response.data))
          const old_stud_data = localStorage.getItem('formData')
          if (old_stud_data) {
            setFormData(JSON.parse(old_stud_data))
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  }, [])

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })

  const onSubmit = async (data: FormInputs) => {
    // event.preventDefault()

    let storedNewStudentId = localStorage.getItem('newStudentId')
    if (studentId_param) {
      storedNewStudentId = studentId_param
    }

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

  // const onSubmit = async (data: FormInputs) => {
  // try {
  //   await validationSchema.validate(data, {
  //     abortEarly: false
  //   })
  //   console.log('Form data is valid:', data)
  // } catch (validationErrors) {
  //   console.error('Validation errors:', validationErrors.errors)
  // }
  //   handleNext()
  // }

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

      <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
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
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <Controller
                  name='f_name'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={formData?.f_name}
                      label='First Name'
                      onChange={onChange}
                      placeholder='Leonard'
                      error={Boolean(errors.f_name)}
                      aria-describedby='f_name-validation'
                    />
                  )}
                />
                {errors.f_name && (
                  <FormHelperText sx={{ color: 'error.main' }} id='f_name-validation'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <Controller
                  name='m_name'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={formData?.m_name}
                      label='Middle Name'
                      onChange={onChange}
                      placeholder='Cena'
                      error={Boolean(errors.m_name)}
                      aria-describedby='m_name-validation'
                    />
                  )}
                />
                {errors.m_name && (
                  <FormHelperText sx={{ color: 'error.main' }} id='m_name-validation'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <Controller
                  name='l_name'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={formData?.l_name}
                      label='Last Name'
                      onChange={onChange}
                      placeholder='Leonard'
                      error={Boolean(errors.l_name)}
                      aria-describedby='l_name-validation'
                    />
                  )}
                />
                {errors.l_name && (
                  <FormHelperText sx={{ color: 'error.main' }} id='l_name-validation'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={2}>
              <FormControl fullWidth>
                <InputLabel id='gender-validation' error={Boolean(errors.gender)} htmlFor='gender-validation'>
                  Gender
                </InputLabel>
                <Controller
                  name='gender'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      value={value}
                      label='gender'
                      onChange={onChange}
                      error={Boolean(errors.gender)}
                      labelId='gender-validation'
                      aria-describedby='gender-validation'
                    >
                      <MenuItem value='Male'>Male</MenuItem>
                      <MenuItem value='Female'>Female</MenuItem>
                    </Select>
                  )}
                />
                {errors.gender && (
                  <FormHelperText sx={{ color: 'error.main' }} id='gender-validation'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={5}>
              <Controller
                name='dob'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    selected={value}
                    showYearDropdown
                    showMonthDropdown
                    onChange={e => onChange(e)}
                    placeholderText='MM/DD/YYYY'
                    customInput={
                      <CustomInput
                        value={value}
                        onChange={onChange}
                        label='Date of Birth'
                        error={Boolean(errors.dob)}
                        aria-describedby='validation-basic-dob'
                      />
                    }
                  />
                )}
              />
              {errors.dob && (
                <FormHelperText sx={{ mx: 3.5, color: 'error.main' }} id='validation-basic-dob'>
                  This field is required
                </FormHelperText>
              )}
            </Grid>

            <Grid item xs={12} sm={5}>
              <FormControl fullWidth>
                <InputLabel
                  id='nationality-validation'
                  error={Boolean(errors.nationality)}
                  htmlFor='nationality-validation'
                >
                  Nationality
                </InputLabel>
                <Controller
                  name='nationality'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      value={value}
                      label='nationality'
                      onChange={onChange}
                      error={Boolean(errors.nationality)}
                      labelId='nationality-validation'
                      aria-describedby='nationality-validation'
                    >
                      <MenuItem value='Filipino'>Filipino</MenuItem>
                      <MenuItem value='French'>French</MenuItem>
                    </Select>
                  )}
                />
                {errors.nationality && (
                  <FormHelperText sx={{ color: 'error.main' }} id='nationality-validation'>
                    This field is required
                  </FormHelperText>
                )}
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
              <FormControl fullWidth>
                <Controller
                  name='mobile'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Mobile'
                      onChange={onChange}
                      placeholder='963 864 7824'
                      error={Boolean(errors.mobile)}
                      aria-describedby='mobile-validation'
                      InputProps={{
                        startAdornment: <InputAdornment position='start'>PH (+63)</InputAdornment>
                      }}
                    />
                  )}
                />
                {errors.mobile && (
                  <FormHelperText sx={{ color: 'error.main' }} id='mobile-validation'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth type='number' label='Zipcode' placeholder='6200' />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField label='Address' placeholder='7777, Mendez Plains, Florida' />
              </FormControl>
            </Grid>
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
              <Divider sx={{ mb: '0 !important' }} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                Health and Medical Info
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <FormControl error={Boolean(errors.radio)}>
                <FormLabel>Are you vaccinated?</FormLabel>
                <Controller
                  name='radio'
                  control={control}
                  rules={{ required: false }}
                  render={({ field }) => (
                    <RadioGroup
                      row
                      value={vaccinated}
                      onChange={e => {
                        // Update the selected value in the state
                        setVaccinated(e.target.value)
                        setShowSecondDose(false) // Reset the second dose field when changing the vaccination status
                      }}
                      aria-label='vaccine'
                      name='isVaccinatedWrap'
                    >
                      <FormControlLabel
                        value='yes'
                        label='Yes'
                        sx={{
                          color: vaccinated === 'yes' ? 'primary.main' : null // Change color based on selection
                        }}
                        control={<Radio sx={{ color: vaccinated === 'yes' ? 'primary.main' : null }} />}
                      />
                      <FormControlLabel
                        value='no'
                        label='No'
                        sx={{
                          color: vaccinated === 'no' ? 'primary.main' : null // Change color based on selection
                        }}
                        control={<Radio sx={{ color: vaccinated === 'no' ? 'primary.main' : null }} />}
                      />
                    </RadioGroup>
                  )}
                />
                {errors.radio && (
                  <FormHelperText sx={{ color: 'error.main' }} id='isVaccinatedWrap'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            {vaccinated === 'yes' && (
              <Grid item xs={12} sm={6}>
                <Controller
                  name='vaccination_d1'
                  control={control}
                  rules={{ required: false }}
                  render={({ field: { value, onChange } }) => (
                    <DatePicker
                      selected={value}
                      showYearDropdown
                      showMonthDropdown
                      onChange={e => {
                        onChange(e)
                        setShowSecondDose(true)
                      }}
                      placeholderText='MM/DD/YYYY'
                      customInput={
                        <CustomInput
                          value={value}
                          onChange={onChange}
                          label='Date of 1st Dose'
                          error={Boolean(errors.vaccination_d1)}
                          aria-describedby='validation-basic-dob'
                        />
                      }
                    />
                  )}
                />
              </Grid>
            )}
            {showSecondDose && (
              <Grid item xs={12} sm={6}>
                <Controller
                  name='vaccination_d2'
                  control={control}
                  rules={{ required: false }}
                  render={({ field: { value, onChange } }) => (
                    <DatePicker
                      selected={value}
                      showYearDropdown
                      showMonthDropdown
                      onChange={e => onChange(e)}
                      placeholderText='MM/DD/YYYY'
                      customInput={
                        <CustomInput
                          value={value}
                          onChange={onChange}
                          label='Date of 2nd Dose'
                          error={Boolean(errors.vaccination_d1)}
                          aria-describedby='validation-basic-dob'
                        />
                      }
                    />
                  )}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <FormControl error={Boolean(errors.booster)}>
                <FormLabel>Already had your Booster?</FormLabel>
                <Controller
                  name='booster'
                  control={control}
                  rules={{ required: false }}
                  render={({ field }) => (
                    <RadioGroup row {...field} aria-label='vaccine' name='isVaccinatedWrap'>
                      <FormControlLabel
                        value='yes'
                        label='Yes'
                        sx={errors.booster ? { color: 'error.main' } : null}
                        control={<Radio sx={errors.booster ? { color: 'error.main' } : null} />}
                      />
                      <FormControlLabel
                        value='no'
                        label='No'
                        sx={errors.booster ? { color: 'error.main' } : null}
                        control={<Radio sx={errors.booster ? { color: 'error.main' } : null} />}
                      />
                    </RadioGroup>
                  )}
                />
                {errors.booster && (
                  <FormHelperText sx={{ color: 'error.main' }} id='isVaccinatedWrap'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ mb: '0 !important' }} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                Other medical information
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl error={Boolean(errors.allergies)}>
                <FormLabel>Do you have allergies?</FormLabel>
                <Controller
                  name='allergies'
                  control={control}
                  rules={{ required: false }}
                  render={({ field }) => (
                    <RadioGroup row {...field} aria-label='allergies' name='allergies'>
                      <FormControlLabel
                        value='yes'
                        label='Yes'
                        sx={errors.allergies ? { color: 'error.main' } : null}
                        control={<Radio sx={errors.allergies ? { color: 'error.main' } : null} />}
                      />
                      <FormControlLabel
                        value='no'
                        label='No'
                        sx={errors.allergies ? { color: 'error.main' } : null}
                        control={<Radio sx={errors.allergies ? { color: 'error.main' } : null} />}
                      />
                    </RadioGroup>
                  )}
                />
                {errors.allergies && (
                  <FormHelperText sx={{ color: 'error.main' }} id='allergies'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl error={Boolean(errors.treatment)}>
                <FormLabel>Any prolonged treatment?</FormLabel>
                <Controller
                  name='treatment'
                  control={control}
                  rules={{ required: false }}
                  render={({ field }) => (
                    <RadioGroup row {...field} aria-label='vaccine' name='treatment'>
                      <FormControlLabel
                        value='yes'
                        label='Yes'
                        sx={errors.treatment ? { color: 'error.main' } : null}
                        control={<Radio sx={errors.treatment ? { color: 'error.main' } : null} />}
                      />
                      <FormControlLabel
                        value='no'
                        label='No'
                        sx={errors.treatment ? { color: 'error.main' } : null}
                        control={<Radio sx={errors.treatment ? { color: 'error.main' } : null} />}
                      />
                    </RadioGroup>
                  )}
                />
                {errors.treatment && (
                  <FormHelperText sx={{ color: 'error.main' }} id='treatment'>
                    This field is required
                  </FormHelperText>
                )}
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
