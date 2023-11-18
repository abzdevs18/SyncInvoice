// ** React Imports
import { useState, useEffect, MouseEvent, useCallback } from 'react'

// ** Next Imports
import Link from 'next/link'
import { GetStaticProps, InferGetStaticPropsType } from 'next/types'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { DataGrid } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import Select, { SelectChangeEvent } from '@mui/material/Select'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
import { fetchData } from 'src/store/apps/subject'

// ** Third Party Components
import axios from 'axios'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { CardStatsType } from 'src/@fake-db/types'
import { ThemeColor } from 'src/@core/layouts/types'
import { SubjectsType } from 'src/types/apps/subjectTypes'
import { CardStatsHorizontalProps } from 'src/@core/components/card-statistics/types'

// ** Custom Table Components Imports
import TableHeader from 'src/views/apps/subject/list/TableHeader'
import AddSubjectDrawer from 'src/views/apps/subject/list/AddSubjectDrawer'
import { AvatarGroup, CircularProgress, Tooltip } from '@mui/material'
import CustomAvatar from 'src/@core/components/mui/avatar'

interface UserRoleType {
  [key: string]: { icon: string; color: string }
}

interface UserStatusType {
  [key: string]: ThemeColor
}

// ** Vars
const userRoleObj: UserRoleType = {
  Admin: { icon: 'mdi:laptop', color: 'error.main' },
  author: { icon: 'mdi:cog-outline', color: 'warning.main' },
  editor: { icon: 'mdi:pencil-outline', color: 'info.main' },
  maintainer: { icon: 'mdi:chart-donut', color: 'success.main' },
  Student: { icon: 'mdi:account-outline', color: 'primary.main' },
  subscriber: { icon: 'mdi:account-outline', color: 'primary.main' }
}

interface CellType {
  row: SubjectsType
}

const userStatusObj: UserStatusType = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary',
  online: 'secondary'
}

const StyledLink = styled(Link)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))

const RowOptions = ({ id }: { id: number | string }) => {
  // ** Hooks
  // const dispatch = useDispatch<AppDispatch>()
  //
  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    // dispatch(deleteUser(id))
    handleRowOptionsClose()
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='mdi:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem
          component={Link}
          sx={{ '& svg': { mr: 2 } }}
          onClick={handleRowOptionsClose}
          href='/apps/user/view/overview/'
        >
          <Icon icon='mdi:eye-outline' fontSize={20} />
          View
        </MenuItem>
        <MenuItem onClick={handleRowOptionsClose} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='mdi:pencil-outline' fontSize={20} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='mdi:delete-outline' fontSize={20} />
          Delete
        </MenuItem>
      </Menu>
    </>
  )
}

const columns = [
  {
    flex: 0.2,
    minWidth: 230,
    field: 'subjectName',
    headerName: 'Subject Name',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 2 }}>
          <StyledLink href={`/admin/subject/view/${row.id}`}>{row.name}</StyledLink>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AvatarGroup className='pull-up' sx={{ mr: 2 }}>
              {row.teachers &&
                (
                  row.teachers as Array<{ teacher: { id: string; avatar: string; f_name: string; l_name: string } }>
                ).map((teacherSubject, index) => {
                  const person = teacherSubject.teacher

                  return (
                    <Tooltip key={index} title={`Teacher ${person.f_name} ${person.l_name}`}>
                      <StyledLink href={`/apps/user/${person.id}/view/overview/`} sx={{ height: 25, width: 25 }}>
                        <CustomAvatar
                          src={`/images/avatars/` + person.avatar + `.png`}
                          alt={`Teacher ${person.f_name} ${person.l_name}`}
                          sx={{ height: 25, width: 25 }}
                        />
                      </StyledLink>
                    </Tooltip>
                  )
                })}
            </AvatarGroup>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 250,
    field: 'Subject Track',
    headerName: 'Subject Tracks',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap variant='body2'>
          {row.gradeLevel}
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    field: 'Grade Level',
    minWidth: 150,
    headerName: 'Grade Level',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography variant='subtitle1' noWrap sx={{ textTransform: 'capitalize' }}>
          {row.gradeLevel}
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: 'STRAND',
    field: 'strand',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography variant='subtitle1' noWrap sx={{ textTransform: 'capitalize' }}>
          {row.strand}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: 'status',
    headerName: 'Status',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography variant='subtitle1' noWrap sx={{ textTransform: 'capitalize' }}>
          Active
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 90,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }: CellType) => <RowOptions id={row.id} />
  }
]

const SubjectList = ({ apiData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  // ** State
  const [gradeLevel, setGradeLevel] = useState<string>('')
  const [subjectTrack, setSubjectTrack] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [subjectStrand, setStrand] = useState<string>('')
  const [pageSize, setPageSize] = useState<number>(10)
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  const isLoading = useSelector((state: RootState) => state.subject.loading)

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.subject)

  useEffect(() => {
    dispatch(
      fetchData({
        gradeLevel,
        subjectStrand,
        subjectTrack,
        q: ''
      })
    )
  }, [dispatch, subjectTrack, setGradeLevel, subjectStrand, value])

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const handleGradeLevelChange = useCallback((e: SelectChangeEvent) => {
    setGradeLevel(e.target.value)
  }, [])

  const handleSubjectTrackChange = useCallback((e: SelectChangeEvent) => {
    setSubjectTrack(e.target.value)
  }, [])

  const handleStrandChange = useCallback((e: SelectChangeEvent) => {
    setStrand(e.target.value)
  }, [])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Search Subjects' sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='gradeLevel-select'>Grade Level</InputLabel>
                  <Select
                    fullWidth
                    value={gradeLevel}
                    id='select-gradeLevel'
                    label='Select Level'
                    labelId='gradeLevel-select'
                    onChange={handleGradeLevelChange}
                    inputProps={{ placeholder: 'Select Grade Level' }}
                  >
                    <MenuItem value=''>Select gradeLevel</MenuItem>
                    <MenuItem value='admin'>Admin</MenuItem>
                    <MenuItem value='author'>Author</MenuItem>
                    <MenuItem value='editor'>Editors</MenuItem>
                    <MenuItem value='maintainer'>Maintainer</MenuItem>
                    <MenuItem value='subscriber'>Subscriber</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='subject-track'>Subject Track</InputLabel>
                  <Select
                    fullWidth
                    value={subjectTrack}
                    id='subject-track'
                    label='Subject Track'
                    labelId='subject-track'
                    onChange={handleSubjectTrackChange}
                    inputProps={{ placeholder: 'Subject Track' }}
                  >
                    <MenuItem value=''>Subject Track</MenuItem>
                    <MenuItem value='stem'>STEM</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='subject-strand'>Select STRAND</InputLabel>
                  <Select
                    fullWidth
                    value={subjectStrand}
                    id='select-strand'
                    label='Select Status'
                    labelId='subject-STRAND'
                    onChange={handleStrandChange}
                    inputProps={{ placeholder: 'Select STRAND' }}
                  >
                    <MenuItem value=''>Select STRAND</MenuItem>
                    <MenuItem value='STRAND'>STRAND</MenuItem>
                    <MenuItem value='HUMS'>HUMS</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} />
          {isLoading ? (
            <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <CircularProgress sx={{ mb: 4 }} />
              {/* <Typography>Loading...</Typography> */}
            </Box>
          ) : (
            <DataGrid
              autoHeight
              rows={store.data}
              columns={columns}
              checkboxSelection
              pageSize={pageSize}
              disableSelectionOnClick
              rowsPerPageOptions={[10, 25, 50]}
              sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
              onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
            />
          )}
        </Card>
      </Grid>

      <AddSubjectDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
    </Grid>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await axios.get('/cards/statistics')
  const apiData: CardStatsType = res.data

  return {
    props: {
      apiData
    }
  }
}
SubjectList.acl = {
  action: 'manage',
  subject: 'subject-list-page'
}
export default SubjectList
