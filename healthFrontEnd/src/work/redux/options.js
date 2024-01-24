import { createSlice } from '@reduxjs/toolkit'

const initialStateOptions = {
    options:{

        patients:[]
    }
}

const optionsSlice = createSlice({
    name:'optionsSlice',
    initialState:initialStateOptions,
    reducers:{
        setPatientOptions(state, action) {
            state.options.patients = action.payload
      
        },
        ResetOptions(state) {
            state.options.patients = initialStateOptions.options
         
        }
    }
})

export const optionActions = optionsSlice.actions

export default optionsSlice