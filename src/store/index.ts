// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import chat from 'src/store/apps/chat'
import user from 'src/store/apps/user'
import email from 'src/store/apps/email'
import invoice from 'src/store/apps/invoice'
import calendar from 'src/store/apps/calendar'
import permissions from 'src/store/apps/permissions'
import faculty from 'src/store/apps/faculty'
import subject from './apps/subject'
import attendance from './apps/subject/section-list'

export const store = configureStore({
  reducer: {
    user,
    faculty,
    chat,
    email,
    invoice,
    calendar,
    permissions,
    subject,
    attendance
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
