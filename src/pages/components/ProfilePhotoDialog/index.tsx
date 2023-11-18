import React, { useState, SyntheticEvent, useCallback, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slider,
  Box,
  Link,
  Typography,
  Input,
  TypographyProps
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { useDropzone } from 'react-dropzone'
import Cropper from 'react-easy-crop'

const Img = styled('img')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    marginRight: theme.spacing(10)
  },
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  },
  [theme.breakpoints.down('sm')]: {
    width: 250
  }
}))

const HeadingTypography = styled(Typography)<TypographyProps>(({ theme }) => ({
  marginBottom: theme.spacing(5),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(4)
  }
}))

interface FileProp {
  name: string
  type: string
  size: number
}

const ProfileMediaDialog = ({ defaultMedia, type }: { defaultMedia: any; type: any }) => {
  const [open, setOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState(null)
  const [mediaType, setMediaType] = useState('')
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [files, setFiles] = useState<FileProp[]>([])

  useEffect(() => {
    if (files.length > 0) {
      const reader = new FileReader()

      reader.onload = e => {
        setSelectedMedia(e.target.result)
        setMediaType(files[0].type)
      }

      reader.readAsDataURL(files[0])
    }
  }, [files])

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const fileType = event.target.files[0].type
      setMediaType(fileType)

      const reader = new FileReader()

      reader.onload = e => {
        setSelectedMedia(e.target.result)
      }

      reader.readAsDataURL(event.target.files[0])
    }
  }

  const handleCropChange = crop => {
    setCrop(crop)
  }

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
    return new Promise((resolve, reject) => {
      const image = new Image()

      image.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        const maxSize = Math.max(image.width, image.height)
        const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2))

        canvas.width = safeArea
        canvas.height = safeArea

        ctx.translate(safeArea / 2, safeArea / 2)
        ctx.rotate((rotation * Math.PI) / 180)
        ctx.translate(-safeArea / 2, -safeArea / 2)

        ctx.drawImage(image, safeArea / 2 - image.width * 0.5, safeArea / 2 - image.height * 0.5)
        const data = ctx.getImageData(0, 0, safeArea, safeArea)

        canvas.width = pixelCrop.width
        canvas.height = pixelCrop.height

        ctx.putImageData(
          data,
          Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
          Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
        )

        // Convert the canvas to a base64 data URL
        resolve(canvas.toDataURL('image/jpeg'))
      }

      image.onerror = reject
      image.src = imageSrc
    })
  }

  const handleSubmit = async () => {
    try {
      const croppedImageURI = await getCroppedImg(selectedMedia, croppedAreaPixels)

      const response = await fetch(`${process.env.BASE_URL}/api/user/update/2130`, {
        method: 'POST',
        body: JSON.stringify({ img: croppedImageURI }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (response.ok) {
        console.log('Uploaded successfully:', data)
      } else {
        console.error('Upload error:', data.message)
      }

      handleClose()
    } catch (err) {
      console.error(err)
    }
  }

  const renderMediaPreview = () => {
    if (!selectedMedia) return null

    if (mediaType.startsWith('image')) {
      return (
        <Box style={{ height: '550px', position: 'relative', padding: '30px' }}>
          <Cropper
            image={selectedMedia}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={handleCropChange}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            cropShape='round'
          />
        </Box>
      )
    } else if (mediaType.startsWith('video')) {
      return (
        <video controls style={{ maxWidth: '100%', maxHeight: '300px' }}>
          <source src={selectedMedia} type={mediaType} />
          Your browser does not support the video tag.
        </video>
      )
    } else if (mediaType.startsWith('audio')) {
      return (
        <audio controls>
          <source src={selectedMedia} type={mediaType} />
          Your browser does not support the audio tag.
        </audio>
      )
    }

    return null
  }

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: (acceptedFiles: FileProp[]) => {
      setFiles(acceptedFiles)
    }
  })

  const handleLinkClick = (event: SyntheticEvent) => {
    event.preventDefault()
  }

  return (
    <div>
      <Button variant='outlined' color='primary' onClick={handleOpen}>
        Update Media
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
        <DialogTitle>Update Profile</DialogTitle>
        <DialogContent>
          {renderMediaPreview()}

          <Box {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            {selectedMedia ? null : files.length ? (
              // img
              <></>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: ['column', 'column', 'row'], alignItems: 'center' }}>
                <Img width={300} alt='Upload img' src='/images/misc/upload.png' />
                <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: ['center', 'center', 'inherit'] }}>
                  <HeadingTypography variant='h5'>Drop files here or click to upload.</HeadingTypography>
                  <Typography color='textSecondary'>
                    Drop files here or click{' '}
                    <Link href='/' onClick={handleLinkClick}>
                      browse
                    </Link>{' '}
                    thorough your machine
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>

          {mediaType.startsWith('image') && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                maxWidth: 450,
                gap: 4,
                justifyContent: 'center',
                margin: '0 auto'
              }}
            >
              <div style={{ display: 'flex', marginTop: 5 }}>
                <svg
                  style={{ height: '1.4rem' }}
                  viewBox='0 0 24 24'
                  aria-hidden='true'
                  className='r-14j79pv r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr'
                >
                  <g>
                    <path d='M11 4c-3.87 0-7 3.13-7 7s3.13 7 7 7c1.93 0 3.68-.78 4.95-2.05C17.21 14.68 18 12.93 18 11c0-3.87-3.14-7-7-7zm-9 7c0-4.97 4.03-9 9-9s9 4.03 9 9c0 2.12-.74 4.08-1.97 5.62l3.68 3.67-1.42 1.42-3.67-3.68C15.08 19.26 13.12 20 11 20c-4.97 0-9-4.03-9-9zm12.5 1h-7v-2h7v2z'></path>
                  </g>
                </svg>
              </div>
              <Slider
                value={zoom}
                min={1}
                max={3}
                step={0.0001}
                aria-labelledby='Zoom'
                onChange={(e, zoom) => setZoom(zoom)}
                sx={{ marginTop: 2 }}
              />
              <div style={{ display: 'flex', marginTop: 5 }}>
                <svg
                  style={{ height: '1.4rem' }}
                  viewBox='0 0 24 24'
                  aria-hidden='true'
                  className='r-14j79pv r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr'
                >
                  <g>
                    <path d='M11 4c-3.87 0-7 3.13-7 7s3.13 7 7 7c1.93 0 3.68-.78 4.95-2.05C17.21 14.68 18 12.93 18 11c0-3.87-3.14-7-7-7zm-9 7c0-4.97 4.03-9 9-9s9 4.03 9 9c0 2.12-.74 4.08-1.97 5.62l3.68 3.67-1.42 1.42-3.67-3.68C15.08 19.26 13.12 20 11 20c-4.97 0-9-4.03-9-9zm8-1V7.5h2V10h2.5v2H12v2.5h-2V12H7.5v-2H10z'></path>
                  </g>
                </svg>
              </div>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleSubmit} color='primary'>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default ProfileMediaDialog
