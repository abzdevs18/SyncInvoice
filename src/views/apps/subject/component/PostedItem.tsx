import React, { useState, useRef, useEffect } from 'react'

import {
  Card,
  CardHeader,
  Avatar,
  CardContent,
  Typography,
  CardActions,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Tooltip,
  Badge,
  CircularProgress
} from '@mui/material'
import { Icon } from '@iconify/react'
import FavoriteIcon from '@mui/icons-material/Favorite'
import SendIcon from '@mui/icons-material/Send'
import CommentIcon from '@mui/icons-material/Comment'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import TextareaAutosize from '@mui/material/TextareaAutosize'
import ClockIcon from '@mui/icons-material/AccessTime' // Representing time since the comment was posted
import styled from '@emotion/styled'
import Link from 'next/link'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { useAuth } from 'src/hooks/useAuth'
import GetAppIcon from '@mui/icons-material/GetApp'
import axios from 'axios'

function PostedItem({ idx, post, setPostData, postData }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [likeCount, setLikeCount] = useState<number>(0)
  const [liked, setLiked] = useState(false)
  const [docFileSize, setDocFileSize] = useState<any | null>(null)
  const [showAll, setShowAll] = useState(false)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const auth = useAuth()

  const anchorRef = useRef(null)

  const handleReplyClick = (commentId: number) => {
    setReplyingTo(commentId)
  }

  const handleCommentChange = e => {
    setNewComment(e.target.value)
    setError(false)
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      setError(true)
      return
    }
    setError(false)

    const commentData = {
      userId: auth.user.id, // Ensure you have the user's ID in the auth context or fetch it from where you store it
      content: newComment,
      postId: post.id // Ensure you have access to the current post's ID
    }

    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:3001/api/social/post/commentPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(commentData)
      })

      const data = await response.json()

      if (response.ok) {
        const updatedPosts = postData.map(post => {
          if (post.id === commentData.postId) {
            return {
              ...post,
              comments: [data.comment, ...post.comments]
            }
          }
          return post
        })

        setPostData(updatedPosts)
      } else {
        throw new Error(data.message || 'Could not add comment.')
      }
      setNewComment('')

      // Optionally: refetch post or update local state with the new comment
    } catch (err) {
      setError(err.message || 'Something went wrong.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const StyledLink = styled(Link)(({ theme }) => ({
    fontWeight: 600,
    fontSize: '16px',
    textOverflow: 'ellipsis',
    lineHeight: '1.2em',
    cursor: 'pointer',
    textDecoration: 'none',
    color: '#000'
  }))

  const StyledUsername = styled(Link)(({ theme }) => ({
    fontWeight: 400,
    fontSize: '16px',
    cursor: 'pointer',
    textDecoration: 'none',
    textOverflow: 'ellipsis',
    lineHeight: '1.2em',
    color: '#808a9d'
  }))

  const handleMenuOpen = () => {
    setMenuOpen(true)
  }

  const handleMenuClose = () => {
    setMenuOpen(false)
  }

  const handleDeletePost = () => {
    handleMenuClose()
  }

  const likePost = async (postId, userId) => {
    try {
      const response = await axios.post(`${process.env.BASE_URL}/api/social/post/likePost`, {
        postId: postId,
        userId: userId
      })
      if (response.data) {
        setLikeCount(response.data.likesCount)
        if (response.data.message == 'liked') {
          setLiked(true)
        } else {
          setLiked(false)
        }
      }
    } catch (error) {
      console.error('Error liking/unliking post:', error.response ? error.response.data : error.message)
      throw error
    }
  }
  function postTimePass(timestamp) {
    const now = Date.now()
    const date = new Date(timestamp)
    const secondsPast = (now - date) / 1000

    if (secondsPast < 60) {
      return 'Just now'
    }
    if (secondsPast < 3600) {
      return `${Math.round(secondsPast / 60)}m ago`
    }
    if (secondsPast <= 86400) {
      return `${Math.round(secondsPast / 3600)}h ago`
    }
    if (secondsPast <= 172800) {
      // 2 days in seconds
      return `${Math.round(secondsPast / 86400)}d ago`
    }

    // Custom date formatting
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
  }

  function CommentsSection({ post = {} }) {
    const { comments = [] } = post
    if (!comments.length) return null

    return (
      <div>
        {post.comments.slice(0, showAll ? post.comments.length : 2).map((comment, idx) => (
          <React.Fragment key={idx}>
            <ListItem
              alignItems='flex-start'
              sx={{ width: '100%', gap: 2, transition: 'all .2s ease-in-out', marginLeft: 1 }}
            >
              <ListItemAvatar sx={{ margin: 0 }}>
                <Avatar sx={{ width: '32px', height: '32px' }}>
                  {comment.user.avatar ? (
                    <img
                      src={`/images/avatars/` + comment.user.avatar + `.png`}
                      alt={comment.user.f_name}
                      style={{ width: '100%' }}
                    />
                  ) : (
                    comment.user.f_name
                  )}
                </Avatar>
              </ListItemAvatar>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  px: 3,
                  py: 2,
                  maxWidth: 'max-content',
                  backgroundColor: '#3331',
                  borderRadius: '15px',
                  borderTopLeftRadius: 0
                }}
              >
                <Box sx={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 'bold' }} component='span' variant='body2' color='text.primary'>
                    {comment.user.f_name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {/* <ClockIcon fontSize='small' /> */}
                    <Typography variant='caption' sx={{ ml: 1 }}>
                      {postTimePass(comment.createdAt)}
                    </Typography>
                  </Box>
                </Box>
                <Typography component='span' variant='body2' color='#000'>
                  {comment.content}
                </Typography>
              </Box>
            </ListItem>
          </React.Fragment>
        ))}

        {post.comments.length > 2 && !showAll ? (
          <Button
            href='#'
            onClick={e => {
              e.preventDefault()
              setShowAll(true)
            }}
            style={{
              backgroundColor: 'transparent',
              border: 0,
              margin: '0 0 10px 15px',
              color: '#333',
              textTransform: 'capitalize'
            }}
          >
            View more comments
          </Button>
        ) : (
          <Button
            href='#'
            onClick={e => {
              e.preventDefault()
              setShowAll(false)
            }}
            style={{
              backgroundColor: 'transparent',
              border: 0,
              margin: '0 0 10px 15px',
              color: '#333',
              textTransform: 'capitalize'
            }}
          >
            Hide comments
          </Button>
        )}
      </div>
    )
  }

  const CommentActions = ({ idx, postedTime }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Tooltip title='Like'>
          <IconButton size='small'>
            <FavoriteIcon fontSize='small' />
          </IconButton>
        </Tooltip>
        <Tooltip title='Reply'>
          <IconButton size='small' onClick={() => handleReplyClick(idx)}>
            <CommentIcon fontSize='small' />
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <ClockIcon fontSize='small' />
        <Typography variant='caption' sx={{ ml: 1 }}>
          {postedTime}
        </Typography>
      </Box>
    </Box>
  )

  useEffect(() => {
    if (post.media && !post.media.mimetype.startsWith('image') && !post.media.mimetype.startsWith('video')) {
      fetch(`${process.env.BASE_URL}/api/fetchFilesize?filename=${post.media.filename}`)
        .then(response => response.json())
        .then(data => {
          setDocFileSize(data.filesize)
          return
        })
        .catch(error => {
          console.error('Error fetching students data:', error)
        })
    }
    const userHasLiked = post.likes.some(like => like.userId === auth.user.id)
    setLiked(userHasLiked)
  }, [post])

  return (
    <>
      <Card key={idx} sx={{ marginTop: 2, marginBottom: 3 }}>
        <CardHeader
          avatar={<CustomAvatar src={`/images/avatars/` + post.userAvatar + `.png`} />}
          title={
            <>
              <StyledLink href={'/'}>{post.fullName}</StyledLink>{' '}
              <StyledUsername href={'/'}>@{post.username}</StyledUsername>
            </>
          }
          subheader={postTimePass(post.formattedDate)}
        />
        <Menu anchorEl={anchorRef.current} open={menuOpen} onClose={handleMenuClose}>
          <MenuItem onClick={handleDeletePost}>Delete Post</MenuItem>
        </Menu>
        <CardContent>
          <Typography variant='body1' sx={{ color: '#0d1421' }}>
            {post.content}
          </Typography>

          <Box display='flex' flexDirection='column' alignItems='stretch' mt={2} position={'relative'}>
            {post.media && (
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
                {post.media && post.media.mimetype.startsWith('image') && (
                  <img
                    src={post.media.path}
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

                {post.media && post.media.mimetype.startsWith('video') && (
                  <video width='100%' controls>
                    <source src={post.media.path} type={post.media.mimetype} />
                    Your browser does not support the video tag.
                  </video>
                )}

                {post.media && !post.media.mimetype.startsWith('image') && !post.media.mimetype.startsWith('video') && (
                  <List>
                    <ListItem sx={{ display: 'flex', justifyContent: 'space-between', p: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ display: 'flex', marginRight: 4, fontSize: '2rem' }}>
                          <Icon icon='mdi:file-document-outline' />
                        </div>
                        <div>
                          <Typography sx={{ fontWeight: 600, fontSize: '1rem' }}>{post.media.filename}</Typography>
                          <Typography sx={{ fontSize: '0.7rem' }} variant='body1'>
                            {Math.round(docFileSize / 100) / 10 > 1000
                              ? `${(Math.round(docFileSize / 100) / 10000).toFixed(1)} mb`
                              : `${(Math.round(docFileSize / 100) / 10).toFixed(1)} kb`}
                          </Typography>
                        </div>
                      </div>
                      <a href={`${process.env.BASE_URL}/api/downloadFile?filename=${post.media.filename}`} download>
                        <IconButton onClick={() => {}}>
                          <GetAppIcon />
                        </IconButton>
                      </a>
                    </ListItem>
                  </List>
                )}
              </div>
            )}
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ px: 5, py: 0, justifyContent: 'space-between', backgroundColor: 'transparent' }}>
          <IconButton
            color='inherit'
            aria-haspopup='true'
            onClick={() => {
              likePost(post.id, auth.user.id)
            }}
            aria-controls='customized-menu'
            sx={{
              '&:hover': {
                backgroundColor: 'transparent'
              },
              '&:hover svg': {
                fill: '#c00'
              }
            }}
          >
            <Badge
              color='error'
              variant='dot'
              invisible={true}
              sx={{
                display: 'flex',
                gap: 2,
                '&:hover': {
                  backgroundColor: 'transparent'
                },
                '& .MuiBadge-badge': {
                  top: 4,
                  right: 4,
                  boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}`
                }
              }}
            >
              <svg xmlns='http://www.w3.org/2000/svg' height='1em' viewBox='0 0 512 512'>
                {liked ? (
                  <path
                    d='M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z'
                    fill='#c00'
                  />
                ) : (
                  <path d='M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z' />
                )}
              </svg>
              {liked ? (
                <Typography>{likeCount ? likeCount : post.likes.length}</Typography>
              ) : (
                <Typography>{post.likes.length ? post.likes.length : null}</Typography>
              )}
            </Badge>
          </IconButton>
          <IconButton
            color='inherit'
            aria-haspopup='true'
            onClick={() => {}}
            aria-controls='customized-menu'
            sx={{
              '&:hover': {
                backgroundColor: 'transparent'
              },
              '&:hover svg': {
                fill: '#c00'
              }
            }}
          >
            <Badge
              color='error'
              variant='dot'
              invisible={true}
              sx={{
                display: 'flex',
                gap: 2,
                '&:hover': {
                  backgroundColor: 'transparent'
                },
                '& .MuiBadge-badge': {
                  top: 4,
                  right: 4,
                  boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}`
                }
              }}
            >
              <svg xmlns='http://www.w3.org/2000/svg' height='1em' viewBox='0 0 512 512'>
                <path d='M168.2 384.9c-15-5.4-31.7-3.1-44.6 6.4c-8.2 6-22.3 14.8-39.4 22.7c5.6-14.7 9.9-31.3 11.3-49.4c1-12.9-3.3-25.7-11.8-35.5C60.4 302.8 48 272 48 240c0-79.5 83.3-160 208-160s208 80.5 208 160s-83.3 160-208 160c-31.6 0-61.3-5.5-87.8-15.1zM26.3 423.8c-1.6 2.7-3.3 5.4-5.1 8.1l-.3 .5c-1.6 2.3-3.2 4.6-4.8 6.9c-3.5 4.7-7.3 9.3-11.3 13.5c-4.6 4.6-5.9 11.4-3.4 17.4c2.5 6 8.3 9.9 14.8 9.9c5.1 0 10.2-.3 15.3-.8l.7-.1c4.4-.5 8.8-1.1 13.2-1.9c.8-.1 1.6-.3 2.4-.5c17.8-3.5 34.9-9.5 50.1-16.1c22.9-10 42.4-21.9 54.3-30.6c31.8 11.5 67 17.9 104.1 17.9c141.4 0 256-93.1 256-208S397.4 32 256 32S0 125.1 0 240c0 45.1 17.7 86.8 47.7 120.9c-1.9 24.5-11.4 46.3-21.4 62.9zM144 272a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm144-32a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm80 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z' />
              </svg>
              {post.comments.length ? <Typography>{post.comments.length}</Typography> : null}
            </Badge>
          </IconButton>
          <IconButton
            color='inherit'
            aria-haspopup='true'
            onClick={() => {}}
            aria-controls='customized-menu'
            sx={{
              '&:hover': {
                backgroundColor: 'transparent'
              },
              '&:hover svg': {
                fill: '#c00'
              }
            }}
          >
            <Badge
              color='error'
              variant='dot'
              invisible={true}
              sx={{
                display: 'flex',
                gap: 2,
                '&:hover': {
                  backgroundColor: 'transparent'
                },
                '& .MuiBadge-badge': {
                  top: 4,
                  right: 4,
                  boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}`
                }
              }}
            >
              <svg xmlns='http://www.w3.org/2000/svg' height='.9em' viewBox='0 0 512 512'>
                <path d='M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376V479.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z' />
              </svg>
              {/* <Typography>3</Typography> */}
            </Badge>
          </IconButton>
          <Button
            variant='text'
            startIcon={
              <svg xmlns='http://www.w3.org/2000/svg' height='1em' viewBox='0 0 448 512'>
                <path d='M8 256a56 56 0 1 1 112 0A56 56 0 1 1 8 256zm160 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z' />
              </svg>
            }
            sx={{
              marginLeft: 1,
              padding: '8px 8px',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          ></Button>
        </CardActions>
        <Divider />
        <CardContent>
          <Box display='flex' alignItems='flex-start' gap={3}>
            <CustomAvatar src={`/images/avatars/` + auth.user.avatar + `.png`} />
            <Box position='relative' flexGrow={1}>
              <TextareaAutosize
                minRows={1}
                value={newComment}
                onChange={handleCommentChange}
                placeholder='Write a comment...'
                style={{
                  width: '100%',
                  padding: '8px 12px 30px 12px',
                  borderRadius: '15px',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderColor: error ? 'red' : 'rgba(0, 0, 0, 0.1)',
                  transition: 'border-color 0.3s ease',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  lineHeight: '1.5',
                  color: 'rgba(0, 0, 0, 0.7)',
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  outline: 'none',
                  transition: 'border-color 0.3s ease',
                  resize: 'none',
                  '&:focus': {
                    borderColor: 'rgba(0, 123, 255, 0.5)'
                  }
                }}
              />
              <IconButton
                onClick={() => handleAddComment(post)}
                style={{ position: 'absolute', right: '10px', bottom: '10px', color: 'primary' }}
              >
                {isLoading ? <CircularProgress size={20} /> : <SendIcon sx={{ color: '#2E5E8C' }} />}
              </IconButton>
            </Box>
          </Box>
        </CardContent>
        {post.comments.length ? <CommentsSection post={post} /> : null}
      </Card>
    </>
  )
}

export default PostedItem
