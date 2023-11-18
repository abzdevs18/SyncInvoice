// ** MUI Components
import Grid from '@mui/material/Grid'

// ** Types
import AttendanceTable from 'src/views/apps/subject/component/AttendanceTable'
import StudentAttendance from 'src/views/apps/subject/component/StudentAttendance'

const AttendanceTab = ({ sectId, subjId }) => {
  return (
    <Grid container spacing={4} xs={12} mt={1}>
      <StudentAttendance sectId={sectId} subjId={subjId} />
    </Grid>
  )
}

export default AttendanceTab
