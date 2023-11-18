// ** MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import FormLabel from '@mui/material/FormLabel'

import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Divider, FormControlLabel, Radio, RadioGroup } from '@mui/material'
import { forwardRef, useState } from 'react'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'

import { DateType } from 'src/types/forms/reactDatepickerTypes'

interface FormInputs {
  radio: string
  checkbox: boolean
}

const defaultValues = {
  dob: null,
  email: '',
  radio: '',
  select: '',
  lastName: '',
  password: '',
  textarea: '',
  firstName: '',
  checkbox: false
}
interface FormInputs {
  father_fname: string
  father_mname: string
  father_lname: string
  f_nationality: string
  father_occupation: string
  father_mobile: string
  mother_fname: string
  mother_mname: string
  mother_lname: string
  m_nationality: string
  mother_occupation: string
  mother_mobile: string
  res_f_fname: string
  res_f_mname: string
  res_f_lname: string
  res_relation: string
  res_f_occupation: string
  res_f_mobile: string
  res_relation_mobile: string
  res_email_mobile: string
}

const CustomInput = forwardRef((props, ref) => {
  return <TextField fullWidth inputRef={ref} label='Date of 1st Dose' autoComplete='off' {...props} />
})

const CustomInput2ndDose = forwardRef((props, ref) => {
  return <TextField fullWidth inputRef={ref} label='Date of 2nd Dose' autoComplete='off' {...props} />
})

const StepPersonalDetails = ({ handleNext, handlePrev }: { [key: string]: () => void }) => {
  const [paymentMethod, setPaymentMethod] = useState<string>('card')
  const [date, setDate] = useState<DateType>(null)
  const [dose2nd, setDose2nd] = useState<DateType>(null)

  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant='h5'>Financial Information</Typography>
        <Typography sx={{ color: 'text.secondary' }}>Enter Your Family Source of Income Below</Typography>
      </Box>

      <form action=''>
        <DatePickerWrapper>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Divider sx={{ mb: '0 !important' }} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                Father Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <Controller
                  name='father_fname'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='First Name'
                      onChange={onChange}
                      placeholder='Leonard'
                      error={Boolean(errors.father_fname)}
                      aria-describedby='validation-basic-first-name'
                    />
                  )}
                />
                {errors.father_fname && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <Controller
                  name='father_mname'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Middle Name'
                      onChange={onChange}
                      placeholder='Cena'
                      error={Boolean(errors.father_mname)}
                      aria-describedby='validation-basic-first-name'
                    />
                  )}
                />
                {errors.father_mname && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <Controller
                  name='father_lname'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Last Name'
                      onChange={onChange}
                      placeholder='Leonard'
                      error={Boolean(errors.father_lname)}
                      aria-describedby='validation-basic-first-name'
                    />
                  )}
                />
                {errors.father_lname && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel
                  id='nationality-validation'
                  error={Boolean(errors.f_nationality)}
                  htmlFor='nationality-validation'
                >
                  Nationality
                </InputLabel>
                <Controller
                  name='f_nationality'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      value={value}
                      label='f_nationality'
                      onChange={onChange}
                      error={Boolean(errors.f_nationality)}
                      labelId='f_nationality-validation'
                      aria-describedby='f_nationality-validation'
                    >
                      <MenuItem value='Filipino'>Filipino</MenuItem>
                      <MenuItem value='French'>French</MenuItem>
                    </Select>
                  )}
                />
                {errors.f_nationality && (
                  <FormHelperText sx={{ color: 'error.main' }} id='f_nationality-validation'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='father_mobile'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='father_mobile'
                      onChange={onChange}
                      placeholder='963 864 7824'
                      error={Boolean(errors.father_mobile)}
                      aria-describedby='father_mobile-validation'
                      InputProps={{
                        startAdornment: <InputAdornment position='start'>PH (+63)</InputAdornment>
                      }}
                    />
                  )}
                />
                {errors.father_mobile && (
                  <FormHelperText sx={{ color: 'error.main' }} id='father_mobile-validation'>
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
                Mother Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <Controller
                  name='mother_fname'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='First Name'
                      onChange={onChange}
                      placeholder='Leonard'
                      error={Boolean(errors.mother_fname)}
                      aria-describedby='validation-basic-first-name'
                    />
                  )}
                />
                {errors.mother_fname && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <Controller
                  name='mother_mname'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Middle Name'
                      onChange={onChange}
                      placeholder='Cena'
                      error={Boolean(errors.mother_mname)}
                      aria-describedby='validation-basic-first-name'
                    />
                  )}
                />
                {errors.mother_mname && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <Controller
                  name='mother_lname'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Last Name'
                      onChange={onChange}
                      placeholder='Leonard'
                      error={Boolean(errors.mother_lname)}
                      aria-describedby='validation-basic-first-name'
                    />
                  )}
                />
                {errors.mother_lname && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-basic-first-name'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel
                  id='m_nationality-validation'
                  error={Boolean(errors.m_nationality)}
                  htmlFor='m_nationality-validation'
                >
                  Nationality
                </InputLabel>
                <Controller
                  name='m_nationality'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      value={value}
                      label='m_nationality'
                      onChange={onChange}
                      error={Boolean(errors.m_nationality)}
                      labelId='m_nationality-validation'
                      aria-describedby='m_nationality-validation'
                    >
                      <MenuItem value='Filipino'>Filipino</MenuItem>
                      <MenuItem value='French'>French</MenuItem>
                    </Select>
                  )}
                />
                {errors.m_nationality && (
                  <FormHelperText sx={{ color: 'error.main' }} id='m_nationality-validation'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='mother_mobile'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='mother_mobile'
                      onChange={onChange}
                      placeholder='963 864 7824'
                      error={Boolean(errors.mother_mobile)}
                      aria-describedby='mother_mobile-validation'
                      InputProps={{
                        startAdornment: <InputAdornment position='start'>PH (+63)</InputAdornment>
                      }}
                    />
                  )}
                />
                {errors.mother_mobile && (
                  <FormHelperText sx={{ color: 'error.main' }} id='mother_mobile-validation'>
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
                Person/s responsible for your financial support:
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <Controller
                  name='res_f_fname'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='First Name'
                      onChange={onChange}
                      placeholder='Leonard'
                      error={Boolean(errors.res_f_fname)}
                      aria-describedby='person_res-f-validation'
                    />
                  )}
                />
                {errors.res_f_fname && (
                  <FormHelperText sx={{ color: 'error.main' }} id='person_res-f-validation'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <Controller
                  name='res_f_mname'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Middle Name'
                      onChange={onChange}
                      placeholder='Cena'
                      error={Boolean(errors.res_f_mname)}
                      aria-describedby='person_res_m-validation'
                    />
                  )}
                />
                {errors.res_f_mname && (
                  <FormHelperText sx={{ color: 'error.main' }} id='person_res_m-validation'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <Controller
                  name='res_f_lname'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Last Name'
                      onChange={onChange}
                      placeholder='Leonard'
                      error={Boolean(errors.res_f_lname)}
                      aria-describedby='person_res_l-validation'
                    />
                  )}
                />
                {errors.res_f_lname && (
                  <FormHelperText sx={{ color: 'error.main' }} id='person_res_l-validation'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='res_relation'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Relation'
                      onChange={onChange}
                      placeholder='Cena'
                      error={Boolean(errors.res_relation)}
                      aria-describedby='res_relation-validation'
                    />
                  )}
                />
                {errors.res_relation && (
                  <FormHelperText sx={{ color: 'error.main' }} id='res_relation-validation'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Controller
                  name='res_f_mobile'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Mobile'
                      onChange={onChange}
                      placeholder='963 864 7824'
                      error={Boolean(errors.res_f_mobile)}
                      aria-describedby='res_f_mobile-validation'
                      InputProps={{
                        startAdornment: <InputAdornment position='start'>PH (+63)</InputAdornment>
                      }}
                    />
                  )}
                />
                {errors.res_f_mobile && (
                  <FormHelperText sx={{ color: 'error.main' }} id='res_f_mobile-validation'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                Sponsor Contact Details
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField label='Email' placeholder='john@gmail.com' />
              </FormControl>
            </Grid>
            <Grid item xs={10}>
              <FormControl fullWidth>
                <TextField label='Address' placeholder='7777, Mendez Plains, Florida' />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={2}>
              <TextField fullWidth type='text' label='Zipcode' placeholder='6200' />
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  color='secondary'
                  variant='contained'
                  onClick={handlePrev}
                  startIcon={<Icon icon='mdi:chevron-left' fontSize={20} />}
                >
                  Previous
                </Button>
                <Button
                  variant='contained'
                  onClick={handleNext}
                  endIcon={<Icon icon='mdi:chevron-right' fontSize={20} />}
                >
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

export default StepPersonalDetails
