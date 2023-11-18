import React, { useRef, useState } from 'react'
import { Box, Avatar, Button, IconButton, Divider, Tooltip, Dialog } from '@mui/material'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import VideocamIcon from '@mui/icons-material/Videocam'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import PostFormDialog from './PostFormDialog'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { useAuth } from 'src/hooks/useAuth'

function CreatePost(sectionId) {
  const [openModal, setOpenModal] = useState(false)
  const auth = useAuth()

  return (
    <Box
      sx={{
        position: 'relative',
        p: 4,
        border: '1px solid rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        backgroundColor: 'white',
        marginBottom: 3
      }}
    >
      <Box display='flex' alignItems='center'>
        <CustomAvatar src={`/images/avatars/` + auth.user.avatar + `.png`} sx={{ width: 'min-width' }} />
        <Box
          onClick={() => setOpenModal(true)}
          role='textbox'
          spellCheck='true'
          placeholder="What's new today, teach?"
          sx={{
            flexGrow: 1,
            fontSize: '1.2rem',
            cursor: 'pointer',
            pl: 4,
            pr: 4,
            py: 1,
            borderRadius: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            outline: 'none',
            overflowWrap: 'break-word',
            marginLeft: 2,
            '&:empty:before': {
              content: '"What\'s new today, Teach?"',
              color: 'gray'
            }
          }}
        />
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box display='flex' alignItems='center' justifyContent='space-between'>
        <Box display='flex' alignItems='center'>
          <Button
            startIcon={<PhotoCameraIcon />}
            component='label'
            onClick={() => setOpenModal(true)}
            htmlFor='photo-upload'
            size='small'
          >
            Photo
          </Button>
          <Button
            startIcon={<VideocamIcon />}
            component='label'
            onClick={() => setOpenModal(true)}
            htmlFor='video-upload'
            size='small'
          >
            Video
          </Button>
          <Button
            startIcon={<AttachFileIcon />}
            component='label'
            onClick={() => setOpenModal(true)}
            htmlFor='file-upload'
            size='small'
          >
            File
          </Button>
        </Box>
      </Box>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <PostFormDialog onClose={() => setOpenModal(false)} sectionId={sectionId} />
      </Dialog>
    </Box>
  )
}

export default CreatePost
