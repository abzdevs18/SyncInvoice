// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

// ** Types
import { Dispatch } from 'redux'
import { SendMsgParamsType } from 'src/types/apps/chatTypes'

interface DataParams {
  userId: number
}

// ** Create New Chat Room
export const createChatRoom = createAsyncThunk('appChat/createChatRoom', async (memberIds: number[]) => {
  if (!memberIds || memberIds.length < 2) {
    throw new Error('At least two members are required to create a chat room.')
  }

  const response = await axios.post(`${process.env.BASE_URL}/api/social/chat/create-chat-room`, {
    memberIds
  })

  return response.data
})

// ** Fetch User Profile
// export const fetchUserProfile = createAsyncThunk('appChat/fetchUserProfile', async () => {
//   const response = await axios.get(`${process.env.BASE_URL}/api/social/chat/profile-user`)

//   return response.data
// })

// ** Fetch Chats & Contacts
export const fetchChatsContacts = createAsyncThunk('appChat/fetchChatsContacts', async (params: DataParams) => {
  const uId = params.userId
  const response = await axios.get(`${process.env.BASE_URL}/api/social/chat/chat-contact?userId=${uId}`)

  return response.data
})

// ** Select Chat
export const selectChat = createAsyncThunk(
  'appChat/selectChat',
  async (id: number | string, { dispatch }: { dispatch: Dispatch<any> }) => {
    const response = await axios.get(`${process.env.BASE_URL}/api/social/chat/get-chat`, {
      params: {
        id
      }
    })
    // await dispatch(fetchChatsContacts())

    return response.data
  }
)

// ** Send Msg
export const sendMsg = createAsyncThunk('appChat/sendMsg', async (obj: SendMsgParamsType, { dispatch }) => {
  const response = await axios.post(`${process.env.BASE_URL}/api/social/chat/send-msg`, {
    data: {
      obj
    }
  })
  if (obj.contact) {
    await dispatch(selectChat(obj.contact.id))
  }
  // await dispatch(fetchChatsContacts())

  return response.data
})

export const appChatSlice = createSlice({
  name: 'appChat',
  initialState: {
    chats: null,
    contacts: null,
    userProfile: null,
    selectedChat: null,
    error: null, // New error property to store any errors
    loading: false // New loading property to indicate if the app is in a loading state
  },
  reducers: {
    removeSelectedChat: state => {
      state.selectedChat = null
    }
  },
  extraReducers: builder => {
    // builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
    //   state.userProfile = action.payload
    // })
    builder.addCase(fetchChatsContacts.fulfilled, (state, action) => {
      state.contacts = action.payload.contacts
      state.chats = action.payload.chatsContacts
      console.log('D')
    })
    builder.addCase(selectChat.fulfilled, (state, action) => {
      state.selectedChat = action.payload
    })
    builder.addCase(createChatRoom.fulfilled, (state, action) => {
      if (state.chats) {
        state.chats.push(action.payload) // Adding the newly created chat room to the list of chats.
      } else {
        state.chats = [action.payload]
      }
    })
    builder.addCase(createChatRoom.rejected, (state, action) => {
      console.error('Error creating chat room:', action.error.message)
    })
    // Similarly, for other thunks...
    // builder.addCase(fetchUserProfile.rejected, (state, action) => {
    //   console.error('Error fetching user profile:', action.error.message)
    // })
    //... and so on for each thunk.
  }
})

export const { removeSelectedChat } = appChatSlice.actions

export default appChatSlice.reducer
