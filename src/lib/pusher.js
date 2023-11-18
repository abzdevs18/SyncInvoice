// lib/pusher.js
import Pusher from 'pusher-js'

const pusher = new Pusher('eb050beae7a43ee98f54', {
  cluster: 'ap1',
  encrypted: true
})

export default pusher
