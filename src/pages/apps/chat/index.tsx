// ** React Imports
import { useContext, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { sendMsg, selectChat, fetchUserProfile, fetchChatsContacts, removeSelectedChat } from 'src/store/apps/chat'

// ** Types
import { RootState, AppDispatch } from 'src/store'
import { StatusObjType, StatusType } from 'src/types/apps/chatTypes'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Utils Imports
import { getInitials } from 'src/@core/utils/get-initials'
import { formatDateToMonthShort } from 'src/@core/utils/format'

// ** Chat App Components Imports
import SidebarLeft from 'src/views/apps/chat/SidebarLeft'
import ChatContent from 'src/views/apps/chat/ChatContent'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { Card, CardContent, CardHeader, Grid, Typography } from '@mui/material'

// import pusher from 'src/lib/pusher'
import { useAuth } from 'src/hooks/useAuth'

const AppChat = () => {
  // ** Hooks
  const ability = useContext(AbilityContext)
  const auth = useAuth()

  // ** States
  const [userStatus, setUserStatus] = useState<StatusType>('online')
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)
  const [userProfileLeftOpen, setUserProfileLeftOpen] = useState<boolean>(false)
  const [userProfileRightOpen, setUserProfileRightOpen] = useState<boolean>(false)

  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const dispatch = useDispatch<AppDispatch>()
  const hidden = useMediaQuery(theme.breakpoints.down('lg'))
  const store = useSelector((state: RootState) => state.chat)

  // ** Vars
  const { skin } = settings
  const smAbove = useMediaQuery(theme.breakpoints.up('sm'))
  const sidebarWidth = smAbove ? 370 : 300
  const mdAbove = useMediaQuery(theme.breakpoints.up('md'))
  const statusObj: StatusObjType = {
    busy: 'error',
    away: 'warning',
    online: 'success',
    offline: 'secondary'
  }

  useEffect(() => {
    // dispatch(fetchUserProfile())
    dispatch(fetchChatsContacts({ userId: auth.user.id }))
  }, [dispatch])

  // useEffect(() => {
  //   const channel = pusher.subscribe('chat-system')

  //   channel.bind('get-messages', data => {
  //     console.log(data)
  //   })

  //   // Unsubscribe when component unmounts
  //   return () => {
  //     channel.unbind('get-messages')
  //     pusher.unsubscribe('chat-system')
  //   }
  // }, [])

  // Ably
  // import ably from '../lib/ably';

  // function YourComponent() {
  //   useEffect(() => {
  //     const channel = ably.channels.get('your-channel');

  //     channel.subscribe('your-event', (message) => {
  //       console.log(message.data);
  //     });
  //     return () => {
  //       channel.unsubscribe('your-event');
  //     };
  //   }, []);

  //   return <div>Your content here</div>;
  // }

  // export default YourComponent;

  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)
  const handleUserProfileLeftSidebarToggle = () => setUserProfileLeftOpen(!userProfileLeftOpen)
  const handleUserProfileRightSidebarToggle = () => setUserProfileRightOpen(!userProfileRightOpen)

  return (
    <Box
      className='app-chat'
      sx={{
        width: '100%',
        display: 'flex',
        borderRadius: 1,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: 'background.paper',
        boxShadow: skin === 'bordered' ? 0 : 6,
        ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` })
      }}
    >
      <SidebarLeft
        store={store}
        hidden={hidden}
        mdAbove={mdAbove}
        dispatch={dispatch}
        statusObj={statusObj}
        userStatus={userStatus}
        selectChat={selectChat}
        getInitials={getInitials}
        sidebarWidth={sidebarWidth}
        setUserStatus={setUserStatus}
        leftSidebarOpen={leftSidebarOpen}
        removeSelectedChat={removeSelectedChat}
        userProfileLeftOpen={userProfileLeftOpen}
        formatDateToMonthShort={formatDateToMonthShort}
        handleLeftSidebarToggle={handleLeftSidebarToggle}
        handleUserProfileLeftSidebarToggle={handleUserProfileLeftSidebarToggle}
      />
      <ChatContent
        store={store}
        hidden={hidden}
        sendMsg={sendMsg}
        mdAbove={mdAbove}
        dispatch={dispatch}
        statusObj={statusObj}
        getInitials={getInitials}
        sidebarWidth={sidebarWidth}
        userProfileRightOpen={userProfileRightOpen}
        handleLeftSidebarToggle={handleLeftSidebarToggle}
        handleUserProfileRightSidebarToggle={handleUserProfileRightSidebarToggle}
      />
      {ability?.can('delete', 'guard-chat') ? (
        <Grid item md={6} xs={12}>
          <Card>
            <CardHeader title='Guard Chat' />
            <CardContent>
              <Typography sx={{ mb: 4 }}>Only users with the 'guard' role can view this card</Typography>
            </CardContent>
          </Card>
        </Grid>
      ) : null}
    </Box>
  )
}
AppChat.acl = {
  action: 'read',
  subject: 'chat-page'
}
AppChat.contentHeightFixed = true

export default AppChat
