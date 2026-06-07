import { incrementAsync } from './../../../node_modules/@reduxjs/toolkit/src/listenerMiddleware/tests/listenerMiddleware.withTypes.test-d';
import { createSlice } from '@reduxjs/toolkit';




const initialState = {
    count : 0
}

const counterSlice = createSlice({
    name : 'counter',
    initialState,
    reducers:{
       increment:(state)=>{
         state.count++;
       }, increase:(state, action)=>{
        state.count +=action.payload
       }
    }

})


 export const counterReducer=counterSlice.reducer
  export const  {increment , increase} = counterSlice.actions