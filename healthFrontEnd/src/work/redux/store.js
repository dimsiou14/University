import { configureStore } from '@reduxjs/toolkit'
import userSlice from './user'
import optionsSlice from './options'
import authSlice from './auth'

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    options: optionsSlice.reducer,
    auth: authSlice.reducer
  }
})

export default store