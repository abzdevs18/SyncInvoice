// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

interface DataParams {
  q: string
  role: string
  status: string
  currentPlan: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** Fetch Users
export const fetchData = createAsyncThunk('appFaculty/fetchData', async (params: DataParams) => {
  const response = await axios.get(`${process.env.BASE_URL}/api/faculty/list`, {
    params
  })

  return response.data
})

// ** Add User
export const addUser = createAsyncThunk(
  'appFaculty/addUser',
  async (data: { [key: string]: number | string }, { getState, dispatch }: Redux) => {
    const response = await axios.post(`${process.env.BASE_URL}/api/faculty/add`, {
      data
    })
    dispatch(fetchData(getState().user.params))

    return response.data
  }
)

// ** Delete User
export const deleteUser = createAsyncThunk(
  'appFaculty/deleteUser',
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await axios.delete('/apps/faculty/delete', {
      data: id
    })
    dispatch(fetchData(getState().user.params))

    return response.data
  }
)

export const appFacultySlice = createSlice({
  name: 'appFaculty',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: [],
    loading: false
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.pending, state => {
      state.loading = true
    })
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload.users
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.allData
      state.loading = false
    })
    builder.addCase(fetchData.rejected, state => {
      state.loading = false
    })
  }
})

export default appFacultySlice.reducer
