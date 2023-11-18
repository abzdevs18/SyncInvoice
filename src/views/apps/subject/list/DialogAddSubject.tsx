// ** React Imports
import React, { Ref, useState, forwardRef, ReactElement, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Switch from '@mui/material/Switch'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormControlLabel from '@mui/material/FormControlLabel'
import Select, { SelectChangeEvent } from '@mui/material/Select'

// ** Actions Imports
import { fetchData } from 'src/store/apps/subject'
import { AppDispatch } from 'src/store'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import axios from 'axios'
import { CircularProgress } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

interface SubjectData {
  f_name: string
  l_name: string
  contact: string
  email: string
  username: string
}
const initialFormData = {
  subjectName: '',
  subjectTrack: '',
  gradeLevel: 0,
  semester: '',
  strand: '',
  classification: ''
}

const DialogAddSubject = () => {
  // ** States
  const [loading, setLoading] = useState<boolean>(false)
  const [show, setShow] = useState<boolean>(false)
  const [languages, setLanguages] = useState<string[]>([])
  const [gradeLevels, setGradeLevels] = useState([])
  const [subjectTrack, setSubjectTrack] = useState([])

  const handleInputChange = event => {
    const { name, value } = event.target
    let updatedFormData = { ...formData, [name]: value }

    // Check if gradeLevel is Grade 11 or 12, then update other fields to "NA"
    if (name === 'gradeLevel' && (value === 11 || value === 12)) {
      updatedFormData = {
        ...updatedFormData,
        subjectTrack: 'NA',
        semester: 'NA',
        strand: 'NA',
        classification: 'NA'
      }
    } else if (
      name === 'gradeLevel' &&
      (formData.gradeLevel === 12 || formData.gradeLevel === 12) &&
      (formData.subjectTrack !== 'NA' ||
        formData.semester !== 'NA' ||
        formData.strand !== 'NA' ||
        formData.classification !== 'NA')
    ) {
      updatedFormData = {
        ...updatedFormData,
        subjectTrack: 'NA',
        semester: 'NA',
        strand: 'NA',
        classification: 'NA'
      }
    }

    setFormData(updatedFormData)
  }

  const [formData, setFormData] = React.useState({
    subjectName: '',
    subjectTrack: '',
    gradeLevel: 0,
    semester: '',
    strand: '',
    classification: ''
  })

  const [strandOptions, setStrandOptions] = useState([])

  const dispatch = useDispatch<AppDispatch>()

  const handleSubmit = async () => {
    // Prevent default form behavior if needed
    event.preventDefault()

    try {
      setLoading(true)
      const response = await axios.post(`${process.env.BASE_URL}/api/subject/add`, formData)
      if (response.status === 200) {
        setLoading(false)
        setShow(false)
        setFormData(initialFormData)

        dispatch(fetchData({}))
      } else {
        console.error('Something went wrong')
      }
    } catch (error) {
      console.error('Error fetching user roles:', error)
    }
  }

  useEffect(() => {
    // Fetch grade levels on component mount
    const fetchGradeLevels = async () => {
      try {
        const response = await axios.get(`${process.env.BASE_URL}/api/subject/grade/levels`)
        if (response.status === 200) {
          setGradeLevels(response.data.levels)
          setSubjectTrack(response.data.track)
        } else {
          console.error('Failed to fetch grade levels')
        }
      } catch (error) {
        console.error('Error fetching grade levels:', error)
      }
    }

    fetchGradeLevels()
  }, [])

  useEffect(() => {
    const fetchStrands = async () => {
      try {
        const response = await axios.get(
          `${process.env.BASE_URL}/api/subject/grade/strand?track=${formData.subjectTrack}`
        )
        if (response.status === 200) {
          setStrandOptions(response.data)
        } else {
          console.error('Failed to fetch strands')
        }
      } catch (error) {
        console.error('Error fetching strands:', error)
      }
    }

    if (formData.subjectTrack) {
      fetchStrands()
    } else {
      setStrandOptions([])
    }
  }, [formData.subjectTrack])

  return (
    <Card>
      <Button variant='contained' onClick={() => setShow(true)}>
        Add Subject
      </Button>
      <Dialog
        fullWidth
        open={show}
        maxWidth='md'
        scroll='body'
        onClose={() => setShow(false)}
        TransitionComponent={Transition}
        onBackdropClick={() => setShow(false)}
      >
        <DialogContent sx={{ pb: 6, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
          <IconButton
            size='small'
            onClick={() => setShow(false)}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Icon icon='mdi:close' />
          </IconButton>
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
              Add Subject Information
            </Typography>
            <Typography variant='body2'>Add subject details below and requirements.</Typography>
          </Box>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                defaultValue={formData.subjectName}
                label='Subjet Name'
                placeholder='Math'
                name='subjectName'
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel id='gradelevel-select'>Grade Level</InputLabel>
                <Select
                  defaultValue={formData.gradeLevel}
                  fullWidth
                  labelId='gradelevel-select'
                  label='Grade Level'
                  name='gradeLevel'
                  onChange={handleInputChange}
                >
                  {gradeLevels.map(levelObj => (
                    <MenuItem key={levelObj.id} value={levelObj.id}>
                      {levelObj.level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {(formData.gradeLevel === 13 || formData.gradeLevel === 14) && (
              <Grid container item spacing={6} xs={12} className='subjMoreDetails'>
                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id='subject-classification'>Subject Classification</InputLabel>
                    <Select
                      defaultValue={formData.classification}
                      fullWidth
                      labelId='subject-classification'
                      label='Subject Classification'
                      name='classification'
                      onChange={handleInputChange}
                    >
                      <MenuItem value='core'>Core Subject</MenuItem>
                      <MenuItem value='contextual'>Contextual Subject</MenuItem>
                      <MenuItem value='institutional'>Institutional Subject</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id='subject-track'>Subject Track</InputLabel>
                    <Select
                      defaultValue={formData.subjectTrack}
                      fullWidth
                      labelId='subject-track'
                      label='subject-track'
                      name='subjectTrack'
                      onChange={handleInputChange}
                    >
                      {subjectTrack.map(trackObj => (
                        <MenuItem key={trackObj.id} value={trackObj.id}>
                          {trackObj.name} Track
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id='strand-select'>STRAND/Field</InputLabel>
                    <Select
                      defaultValue={formData.strand}
                      fullWidth
                      labelId='strand-select'
                      label='STRAND/Field'
                      name='strand'
                      onChange={handleInputChange}
                    >
                      {strandOptions.map(strandObj => (
                        <MenuItem key={strandObj.id} value={strandObj.id}>
                          {strandObj.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id='semester-select'>Semester</InputLabel>
                    <Select
                      defaultValue={formData.semester}
                      fullWidth
                      labelId='semester-select'
                      label='Semester'
                      name='semester'
                      onChange={handleInputChange}
                    >
                      <MenuItem value='1st_semester'>1st Sem</MenuItem>
                      <MenuItem value='2nd_semester'>2nd Sem</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
          <Button variant='contained' sx={{ mr: 2, minWidth: '136px' }} onClick={handleSubmit} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Submit'}
          </Button>

          <Button variant='outlined' sx={{ px: 8 }} color='secondary' onClick={() => setShow(false)}>
            Discard
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default DialogAddSubject
