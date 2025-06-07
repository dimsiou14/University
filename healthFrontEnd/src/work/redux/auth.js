import { createSlice } from '@reduxjs/toolkit'

const initialStateOptions = {
    options: {

        token: ""
    }
}

const authSlice = createSlice({
    name: 'authSlice',
    initialState: initialStateOptions,
    reducers: {
        setToken(state, action) {
            state.options.token = action.payload

        }
    }
})

export const authActions = authSlice.actions

export default authSlice