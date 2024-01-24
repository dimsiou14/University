import { createSlice } from '@reduxjs/toolkit'

const initialStateUser = {
    user:{

        name:'',
        password:'',
        type:-1,
        id: -1,
        email:'',
        afm:'',
        hasOTP:false,
        phoneNumber:'',
        firstname:'',
        lastname:''
    }
}

const userSlice = createSlice({
    name:'userSlice',
    initialState:initialStateUser,
    reducers:{
        SetUser(state, action) {
            state.user.name = action.payload.name
            state.user.password = action.payload.password
            state.user.type = action.payload.type
            state.user.id = action.payload.id
            state.user.email = action.payload.email
            state.user.afm = action.payload.afm
            state.user.hasOTP = action.payload.hasOTP 
            state.user.phoneNumber = action.payload.phoneNumber
            state.user.firstname = action.payload.firstName
            state.user.lastname = action.payload.lastName
        },
        ResetUser(state) {
            state.user.name = initialStateUser.user.name
            state.user.password = initialStateUser.user.password
            state.user.type = initialStateUser.user.type
            state.user.id = initialStateUser.user.id
            state.user.email = initialStateUser.user.email
            state.user.afm = initialStateUser.user.afm
            state.user.hasOTP = initialStateUser.user.hasOTP
            state.user.phoneNumber = initialStateUser.user.phoneNumber
            state.user.firstname = initialStateUser.firstname
            state.user.lastname = initialStateUser.lastname
        }
    }
})

export const userActions = userSlice.actions

export default userSlice