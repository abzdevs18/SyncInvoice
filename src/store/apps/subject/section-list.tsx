// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

interface DataParams {
  subjId?: string
  sectionID?: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** Fetch Users
export const fetchData = createAsyncThunk('appListSectionStudent/fetchData', async (params: DataParams) => {
  const subjId = params.subjId
  const sectionID = params.sectionID
  const response = await axios.get(`${process.env.BASE_URL}/api/subject/${sectionID}/attendance/${subjId}`, {
    params
  })
  console.log(response.data)

  return response.data
})

export const appListSectionStudentlice = createSlice({
  name: 'appListSectionStudent',
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
      state.data = action.payload.allData
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

export default appListSectionStudentlice.reducer
