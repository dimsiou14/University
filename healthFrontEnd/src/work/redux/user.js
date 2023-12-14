import { createSlice } from '@reduxjs/toolkit'

const initialStateUser = {
    name:'',
    type:-1
}

const userSlice = createSlice({
    name:'userSlice',
    initialState:initialStateUser,
    reducers:{
        SetUser(state, action) {
            state.name = action.payload.name
            state.type = action.payload.type
        },
        ResetUser(state, action) {
            state.name = initialStateUser.name
            state.type = initialStateUser.type
        }
    }
})

export const userActions = userSlice.actions

export default userSlice