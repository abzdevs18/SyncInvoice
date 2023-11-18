// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Badge from '@mui/material/Badge'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Third Party Components
import clsx from 'clsx'
import { useKeenSlider } from 'keen-slider/react'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

interface SwiperData {
  img: string
  title: string
  details: { [key: string]: string }
}

const data: SwiperData[] = [
  {
    title: 'Top Male Student',
    img: '/images/cards/card-stats-img-1.png',
    details: {
      'Subj I': '16',
      'Subj II': '43',
      'Subj III': '29',
      'Subj IV': '7'
    }
  },
  {
    title: 'Top Female Student',
    img: '/images/cards/card-stats-img-2.png',
    details: {
      'Subj I': '16',
      'Subj II': '9',
      'Subj III': '40',
      'Subj IV': '18'
    }
  }
]

const Slides = () => {
  return (
    <>
      {data.map((slide: SwiperData, index: number) => {
        return (
          <Box key={index} className='keen-slider__slide'>
            <Typography variant='h6' sx={{ color: 'common.white' }}>
              Updates for you
            </Typography>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', '& svg': { color: 'success.main' } }}>
              <Typography variant='caption' sx={{ mr: 1.5, color: 'common.white' }}>
                Published Announcements
              </Typography>
              <Typography variant='subtitle2' sx={{ color: 'success.main', display: 'none' }}>
                +62%
              </Typography>

              {/* <Icon icon='mdi:chevron-up' fontSize={20} /> */}
            </Box>
          </Box>
        )
      })}
    </>
  )
}

const EcommerceWeeklySalesBg = () => {
  // ** States
  const [loaded, setLoaded] = useState<boolean>(false)
  const [currentSlide, setCurrentSlide] = useState<number>(0)

  // ** Hook
  const theme = useTheme()
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      initial: 0,
      rtl: theme.direction === 'rtl',
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel)
      },
      created() {
        setLoaded(true)
      }
    },
    [
      slider => {
        let mouseOver = false
        let timeout: number | ReturnType<typeof setTimeout>
        const clearNextTimeout = () => {
          clearTimeout(timeout as number)
        }
        const nextTimeout = () => {
          clearTimeout(timeout as number)
          if (mouseOver) return
          timeout = setTimeout(() => {
            slider.next()
          }, 4000)
        }
        slider.on('created', () => {
          slider.container.addEventListener('mouseover', () => {
            mouseOver = true
            clearNextTimeout()
          })
          slider.container.addEventListener('mouseout', () => {
            mouseOver = false
            nextTimeout()
          })
          nextTimeout()
        })
        slider.on('dragStarted', clearNextTimeout)
        slider.on('animationEnded', nextTimeout)
        slider.on('updated', nextTimeout)
      }
    ]
  )

  return (
    <Card sx={{ position: 'relative', backgroundColor: 'primary.main' }}>
      <CardContent>
        {loaded && instanceRef.current && (
          <Box className='swiper-dots' sx={{ top: 7, right: 13, position: 'absolute' }}>
            {[...Array(instanceRef.current.track.details.slides.length).keys()].map(idx => {
              return (
                <Badge
                  key={idx}
                  variant='dot'
                  component='div'
                  className={clsx({
                    active: currentSlide === idx
                  })}
                  onClick={() => {
                    instanceRef.current?.moveToIdx(idx)
                  }}
                  sx={{
                    mr: theme => `${theme.spacing(2.5)} !important`,
                    '&.active': {
                      '& .MuiBadge-dot': {
                        backgroundColor: theme => `${theme.palette.common.white} !important`
                      }
                    },
                    '& .MuiBadge-dot': {
                      height: '6px !important',
                      width: '6px !important',
                      minWidth: '6px !important'
                    }
                  }}
                ></Badge>
              )
            })}
          </Box>
        )}
        <Box ref={sliderRef} className='keen-slider'>
          <Slides />
        </Box>
      </CardContent>
    </Card>
  )
}

export default EcommerceWeeklySalesBg
