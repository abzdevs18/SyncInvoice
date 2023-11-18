// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

interface DataParams {
  q?: string
  gradeLevel?: string
  subjectTrack?: string
  subjectStrand?: string
  gradeId?: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** Fetch Users
export const fetchData = createAsyncThunk('appSubjects/fetchData', async (params: DataParams) => {
  const response = await axios.get(`${process.env.BASE_URL}/api/subject/list`, {
    params
  })

  return response.data
})

export const appSubjectSlice = createSlice({
  name: 'appSubjects',
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
      state.data = action.payload.subject
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

export default appSubjectSlice.reducer
