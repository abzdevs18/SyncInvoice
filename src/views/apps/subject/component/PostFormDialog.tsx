import React, { useRef, useState } from 'react'
import {
  Box,
  Avatar,
  Button,
  Typography,
  Divider,
  CircularProgress,
  LinearProgress,
  IconButton,
  ListItem,
  List
} from '@mui/material'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import VideocamIcon from '@mui/icons-material/Videocam'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import styled from '@emotion/styled'
import { Icon } from '@iconify/react'
import axios from 'axios'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { useAuth } from 'src/hooks/useAuth'

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

type FileProp = {
  file: File
  progress: number | null
}

const StyledPostContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  fontSize: '1.2rem',
  cursor: 'pointer',
  pl: 2,
  pr: 2,
  py: 1,
  width: '100%',
  borderRadius: '5px',
  backgroundColor: 'rgba(0, 0, 0, 0.05)',
  outline: 'none',
  minHeight: '100px',
  overflowWrap: 'break-word',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'white',
  '&:empty:before': {
    content: '"What\'s new today, teach?"',
    color: 'gray'
  },
  '&:focus': {
    boxShadow: 'inset 0 0 0 0px #fff,inset 0 0 0 calc(1px + 0px ) rgb(209 213 219 / 1 ), 0 1px 2px 0 #0000000d',
    borderColor: theme.palette.primary.main
  },
  [theme.breakpoints.down('xs')]: {
    width: '100%',
    minWidth: 'auto'
  }
}))

const PostFormDialog = ({ onClose, sectionId }) => {
  const postContentRef = useRef(null)
  const [link, setLink] = useState('')
  const [metadata, setMetadata] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [files, setFiles] = useState<FileProp[]>([])
  const [mediaType, setMediaType] = useState<'photo' | 'video' | 'other' | null>(null)
  const [media, setMedia] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const auth = useAuth()

  const handlePostSubmit = async () => {
    if (postContentRef.current) {
      setIsLoading(true)
      const content = postContentRef.current.innerHTML

      const formData = new FormData()
      formData.append('content', content)
      formData.append('userId', `${auth.user.id}`)
      formData.append('sectionId', `${sectionId.sectionId}`)
      if (media) formData.append('media', media)
      try {
        const response = await axios.post(`${process.env.BASE_URL}/api/social/post/create`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: progressEvent => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setUploadProgress(percentCompleted) // Set the upload percentage
          }
        })

        if (response.status === 201) {
          console.log('Post created:', response.data)
          postContentRef.current.innerHTML = '' // Clear the content after posting
          onClose() // Close the dialog
        }
      } catch (error) {
        console.error('Error creating post:', error)
        // Handle error (e.g., show a notification to the user)
      } finally {
        setIsLoading(false)
        setUploadProgress(null) // Reset upload progress
      }
    }
  }

  const isURL = str => {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    ) // fragment locator
    return !!pattern.test(str)
  }

  const checkForLink = async event => {
    // If the event is from pressing the Enter key
    if (event.type === 'keydown' && event.key !== 'Enter') {
      return
    }
    const content = postContentRef.current.innerText
    if (isURL(content)) {
      setLink(content)

      if (content) {
        try {
          const response = await axios.get(
            `${process.env.BASE_URL}/api/fetchMetadata?url=${encodeURIComponent(content)}`
          )
          setMetadata(response.data)
        } catch (error) {
          console.error('Error fetching metadata', error)
        }
      }
    } else {
      setLink(null)
      setMetadata(null)
    }
  }

  const displayFileSize = size => {
    const kbSize = Math.round(size / 1000)
    return kbSize > 1000 ? `${(kbSize / 1000).toFixed(1)} mb` : `${kbSize.toFixed(1)} kb`
  }

  const fileList = files.map((file: FileProp) => (
    <ListItem key={file.file.name} sx={{ display: 'flex', justifyContent: 'space-between', p: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', marginRight: 4, fontSize: '2rem' }}>
          <Icon icon='mdi:file-document-outline' />
        </div>
        <div>
          <Typography sx={{ fontWeight: 600, fontSize: '1rem' }}>{file.file.name}</Typography>
          <Typography sx={{ fontSize: '0.7rem' }} variant='body1'>
            {Math.round(file.file.size / 100) / 10 > 1000
              ? `${(Math.round(file.file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        <Icon icon='mdi:close' fontSize={20} />
      </IconButton>
    </ListItem>
  ))

  const handleRemoveFile = (fileToRemove: FileProp) => {
    setFiles(prevFiles => prevFiles.filter(file => file.file.name !== fileToRemove.file.name))
    setMedia(null)
    setMediaPreview(null)
  }

  const handleFileChange = (type: string) => event => {
    const file = event.target.files[0]

    if (!file) return

    setMedia(file) // Storing the file
    setMediaType(type)

    if (type === 'photo' || type === 'video') {
      const reader = new FileReader()
      reader.onloadend = () => {
        setMediaPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setMediaPreview('other')
      setFiles(prevFiles => [...prevFiles, { file, progress: null }])
    }
  }

  const handleLinkRemoval = () => {
    setLink(null)
    setMetadata(null)
  }
  const handleMediaRemoval = () => {
    setMedia(null)
    setMediaPreview(null)
  }

  const handleClose = () => {
    onClose() // Close the dialog
  }

  return (
    <Box sx={{ position: 'relative', p: 2, minWidth: '500px' }}>
      <Header>
        <Typography variant='h6' sx={{ padding: 0, margin: 0 }}>
          Create a Post
        </Typography>
        <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>
      <Divider sx={{ my: 2 }} />
      <Box display='flex' alignItems='start' flexDirection={'column'}>
        <Box sx={{ display: 'flex', my: 2, gap: 2, alignContent: 'center', alignItems: 'center' }}>
          <CustomAvatar src={`/images/avatars/` + auth.user.avatar + `.png`} />
          <Typography>
            {auth.user.f_name} {auth.user.l_name}
          </Typography>
        </Box>
        <Box
          contentEditable={true}
          ref={postContentRef}
          role='textbox'
          onBlur={checkForLink}
          onKeyDown={checkForLink}
          spellCheck='true'
          placeholder="What's new today, teach?"
          sx={{
            flexGrow: 1,
            fontSize: '1.2rem',
            cursor: 'pointer',
            pl: 2,
            pr: 2,
            py: 1,
            width: '100%',
            borderRadius: '5px',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            outline: 'none',
            minHeight: '100px',
            overflowWrap: 'break-word',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'white',
            '&:empty:before': {
              content: '"What\'s new today, Teach?"',
              color: 'gray'
            },
            '&:focus': {
              boxShadow:
                'inset 0 0 0 0px #fff,inset 0 0 0 calc(1px + 0px ) rgb(209 213 219 / 1 ), 0 1px 2px 0 #0000000d',

              borderColor: 'primary.main'
            }
          }}
        />
      </Box>
      <Box display='flex' flexDirection='column' alignItems='stretch' mt={2} position={'relative'}>
        {uploadProgress !== null && (
          <LinearProgress variant='determinate' value={uploadProgress} sx={{ position: 1 }} />
        )}
        {mediaPreview && (
          <div
            style={{
              maxWidth: '100%',
              position: 'relative',
              overflow: 'hidden',
              padding: 5,
              borderRadius: 10,
              boxShadow:
                'inset 0 0 0 0px #fff,inset 0 0 0 calc(1px + 0px ) rgb(209 213 219 / 1 ), 0 1px 2px 0 #0000000d'
            }}
          >
            {mediaPreview && media.type.startsWith('image') && (
              <img
                src={mediaPreview}
                alt='Media preview'
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  width: '100%',
                  objectFit: 'cover',
                  maxHeight: '350px',
                  borderRadius: '5px'
                }}
              />
            )}

            {mediaPreview && media.type.startsWith('video') && (
              <video width='100%' controls>
                <source src={mediaPreview} type={media.type} />
                Your browser does not support the video tag.
              </video>
            )}

            {mediaPreview && !media.type.startsWith('image') && !media.type.startsWith('video') && (
              <List>{fileList}</List>
            )}
            {mediaPreview && (media.type.startsWith('video') || media.type.startsWith('image')) && (
              <IconButton
                onClick={handleMediaRemoval}
                style={{ position: 'absolute', right: 5, top: 5, backgroundColor: 'rgba(0,0,0,0.2)', color: '#333' }}
              >
                <Icon icon='mdi:close' fontSize={20} />
              </IconButton>
            )}
          </div>
        )}

        {metadata && (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              padding: '10px',
              border: '1px solid #333',
              borderRadius: '10px',
              position: 'relative'
            }}
          >
            <img src={metadata.image} alt='Preview' style={{ maxWidth: 150 }} />
            <div>
              <h4>{metadata.title}</h4>
              <p>{metadata.description}</p>
            </div>
            <IconButton
              onClick={handleLinkRemoval}
              style={{ position: 'absolute', right: 5, top: 5, backgroundColor: 'rgba(0,0,0,0.2)', color: '#333' }}
            >
              <Icon icon='mdi:close' fontSize={20} />
            </IconButton>
          </Box>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box display='flex' alignItems='center' justifyContent='space-between' mt={2}>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Box display='flex' alignItems='center'>
            <input type='file' accept='image/*' hidden onChange={handleFileChange('photo')} id='photo-upload' />
            <Button startIcon={<PhotoCameraIcon />} component='label' htmlFor='photo-upload' size='small'>
              Photo
            </Button>

            <input
              type='file'
              accept='video/*'
              hidden
              onChange={handleFileChange('video')} // Change to onChange
              id='video-upload'
            />
            <Button startIcon={<VideocamIcon />} component='label' htmlFor='video-upload' size='small'>
              Video
            </Button>

            <input
              type='file'
              hidden
              onChange={handleFileChange('other')} // Change to onChange
              id='file-upload'
            />
            <Button startIcon={<AttachFileIcon />} component='label' htmlFor='file-upload' size='small'>
              File
            </Button>
          </Box>
        </Box>
        {isLoading ? (
          <CircularProgress size={24} /> // Display spinner when loading
        ) : (
          <Button color='primary' variant='contained' size='small' onClick={handlePostSubmit} disabled={isLoading}>
            Post
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default PostFormDialog
