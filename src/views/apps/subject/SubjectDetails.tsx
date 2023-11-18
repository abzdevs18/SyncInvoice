// ** React Imports
import { useState, useEffect, ReactElement, SyntheticEvent } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Components
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'
import { styled, Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'
import CircularProgress from '@mui/material/CircularProgress'

// ** Type Import
import { TeamsTabType, SubjectTabType, ProjectsTabType, SubjectDetailsActiveTab } from 'src/types/apps/subjectTypes'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Subject Components
import DetailsTab from 'src/views/pages/subject/details'
import Students from 'src/views/pages/subject/students'
import Projects from 'src/views/pages/subject/projects'

import SubjectDetailsHeader from 'src/views/apps/subject/SubjectDetailsHeader'
import AttendanceTab from 'src/views/pages/subject/Attendance'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'

const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    minWidth: 65,
    minHeight: 38,
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.up('sm')]: {
      minWidth: 130
    }
  }
}))

const SubjectDetails = ({
  subjId,
  sectionId,
  tab,
  data
}: {
  subjId: string
  sectionId: string
  tab: string
  data: SubjectDetailsActiveTab
}) => {
  // ** State
  const [activeTab, setActiveTab] = useState<string>(tab)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [studentsData, setStudentsData] = useState(null)

  // const sectionDataValue = data.subjectDetailsData
  // const sectionID = data.sections[0].id
  // console.log(data)

  // ** Hooks {sectData.sectionData.name}
  const router = useRouter()
  const hideText = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const handleChange = (event: SyntheticEvent, value: string) => {
    // setIsLoading(true)
    setActiveTab(value)
    router.push({
      pathname: `/apps/subject/view/${subjId}/${sectionId}/${value.toLowerCase()}`
    })
    //   .then(() => setIsLoading(false))
  }

  useEffect(() => {
    if (data) {
      setIsLoading(false)
    }
  }, [data])

  useEffect(() => {
    if (activeTab === 'students') {
      fetch(
        `${process.env.BASE_URL}/api/subject/details/${subjId}/section/student-list?sectionId=${sectionId}&subjId=${subjId}`
      )
        .then(response => response.json())
        .then(data => {
          setStudentsData(data.allData)
        })
        .catch(error => {
          console.error('Error fetching students data:', error)
        })
    }
  }, [activeTab, subjId, sectionId])

  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab)
    }
  }, [tab])

  const tabContentList: { [key: string]: ReactElement } = {
    details: <DetailsTab data={data as SubjectTabType} sectId={sectionId} subjId={subjId} />,
    students: <Students data={studentsData} sectId={sectionId} subjId={subjId} />,
    attendance: <AttendanceTab sectId={sectionId} subjId={subjId} />
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} width={100} sx={{ position: 'relative' }}>
        <SubjectDetailsHeader sectionData={data} />
      </Grid>
      {activeTab === undefined ? null : (
        <Grid item xs={12}>
          <TabContext value={activeTab}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <TabList
                  variant='scrollable'
                  scrollButtons='auto'
                  onChange={handleChange}
                  aria-label='customized tabs example'
                >
                  <Tab
                    value='details'
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', ...(!hideText && { '& svg': { mr: 2 } }) }}>
                        <Icon icon='mdi:account-outline' />
                        {!hideText && 'Details'}
                      </Box>
                    }
                  />
                  <Tab
                    value='students'
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', ...(!hideText && { '& svg': { mr: 2 } }) }}>
                        <Icon icon='mdi:account-multiple-outline' />
                        {!hideText && 'Students'}
                      </Box>
                    }
                  />
                  <Tab
                    value='attendance'
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', ...(!hideText && { '& svg': { mr: 2 } }) }}>
                        <Icon icon='mdi:account-multiple-outline' />
                        {!hideText && 'Attendance'}
                      </Box>
                    }
                  />
                </TabList>
              </Grid>
              <Grid item xs={12}>
                {isLoading ? (
                  <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                    <CircularProgress sx={{ mb: 4 }} />
                    <Typography>Loading...</Typography>
                  </Box>
                ) : (
                  <TabPanel sx={{ p: 0 }} value={activeTab}>
                    {tabContentList[activeTab]}
                  </TabPanel>
                )}
              </Grid>
            </Grid>
          </TabContext>
        </Grid>
      )}
    </Grid>
  )
}

export default SubjectDetails
