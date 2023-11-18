// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch } from 'react-redux'

// ** Actions Imports
import { addUser } from 'src/store/apps/user'

// ** Types Imports
import { AppDispatch } from 'src/store'
import { InputAdornment } from '@mui/material'
import axios from 'axios'

interface SidebarAddUserType {
  open: boolean
  toggle: () => void
}

interface UserData {
  f_name: string
  l_name: string
  contact: string
  email: string
  username: string
}

interface UserRole {
  id: number
  roleName: string
}

const showErrors = (field: string, valueLen: number, min: number) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const schema = yup.object().shape({
  email: yup.string().email().required(),
  contact: yup
    .string()
    .typeError('Contact Number field is required')
    .min(10, obj => showErrors('Contact Number', obj.value.length, obj.min))
    .required(),
  f_name: yup
    .string()
    .min(2, obj => showErrors('First Name', obj.value.length, obj.min))
    .required(),
  l_name: yup
    .string()
    .min(2, obj => showErrors('Username', obj.value.length, obj.min))
    .required()
})

const defaultValues = {
  f_name: '',
  l_name: '',
  contact: '',
  username: '',
  email: ''
}

const SidebarAddUser = (props: SidebarAddUserType) => {
  // ** Props
  const { open, toggle } = props

  // ** State
  const [role, setRole] = useState('')
  const [grade, setGrade] = useState('')

  const [userRole, setUserRole] = useState([])
  const [gradeLevels, setGradeLevels] = useState([])

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: UserData) => {
    dispatch(addUser({ ...data, role }))
    toggle()
    reset()
  }

  const handleClose = () => {
    setUserRole([])
    toggle()
    reset()
  }

  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        const response = await axios.get(`${process.env.BASE_URL}/api/user/role`)
        if (response.status === 200) {
          if (response.data.userRoles) setUserRole(response.data.userRoles)
          if (response.data.grades) setGradeLevels(response.data.grades.map(grade => grade.grade_level))
        }
      } catch (error) {
        console.error('Error fetching user roles:', error)
      }
    }

    fetchUserRoles()
  }, [])

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h6'>Add User</Typography>
        <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='f_name'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='First Name'
                  onChange={onChange}
                  placeholder='John Doe'
                  error={Boolean(errors.f_name)}
                />
              )}
            />
            {errors.f_name && <FormHelperText sx={{ color: 'error.main' }}>{errors.f_name.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='l_name'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Last Name'
                  onChange={onChange}
                  placeholder='John Doe'
                  error={Boolean(errors.l_name)}
                />
              )}
            />
            {errors.l_name && <FormHelperText sx={{ color: 'error.main' }}>{errors.l_name.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='email'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  type='email'
                  value={value}
                  label='Email'
                  onChange={onChange}
                  placeholder='johndoe@email.com'
                  error={Boolean(errors.email)}
                />
              )}
            />
            {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='contact'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  type='text'
                  value={value}
                  label='Contact'
                  onChange={onChange}
                  placeholder='967 294 5153'
                  error={Boolean(errors.contact)}
                  InputProps={{
                    startAdornment: <InputAdornment position='start'>PH (+63)</InputAdornment>
                  }}
                />
              )}
            />
            {errors.contact && <FormHelperText sx={{ color: 'error.main' }}>{errors.contact.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <InputLabel id='role-select'>Select Role</InputLabel>
            <Select
              name='role'
              fullWidth
              value={role}
              id='select-role'
              label='Select Role'
              labelId='role-select'
              onChange={e => setRole(e.target.value)}
              inputProps={{ placeholder: 'Select Role' }}
            >
              {userRole.map(roleItem => (
                <MenuItem key={roleItem.id} value={roleItem.id}>
                  {roleItem.roleName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {role != 1 && (
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Controller
                name='username'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    value={value}
                    label='Username'
                    onChange={onChange}
                    placeholder='John Doe'
                    error={Boolean(errors.username)}
                  />
                )}
              />
              {errors.username && (
                <FormHelperText sx={{ color: 'error.main' }}>{errors.username.message}</FormHelperText>
              )}
            </FormControl>
          )}
          {role === 1 && (
            <FormControl fullWidth sx={{ mb: 6 }}>
              <InputLabel id='grade-level'>Grade Level</InputLabel>
              <Select
                name='grade'
                fullWidth
                value={grade}
                id='select-grade'
                label='Select Grade'
                labelId='grade-level'
                onChange={e => setGrade(e.target.value)}
                inputProps={{ placeholder: 'Select Grade' }}
              >
                {gradeLevels.map((gradeLevel, index) => (
                  <MenuItem key={index} value={gradeLevel}>
                    {gradeLevel}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }}>
              Submit
            </Button>
            <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default SidebarAddUser
