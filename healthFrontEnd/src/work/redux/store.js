import { configureStore } from '@reduxjs/toolkit'
import userSlice from './user'
import optionsSlice from './options'

const store = configureStore({
  reducer: {
    user:userSlice.reducer,
    options:optionsSlice.reducer
  }
})

export default store