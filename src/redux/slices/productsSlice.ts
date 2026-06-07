import { apiServices } from "@/services/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import build from "next/dist/build";



 export const getAllProducts = createAsyncThunk("products/getAllProducts",async()=>{
    const {data} = await apiServices.getAllProducts()
    return data
})

const initialState:{products :any[]}={
    products: []
}

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {}, // لازم تحط هنا حتى لو فاضي
    extraReducers:(builder)=>{
        builder.addCase(getAllProducts.pending,()=>{
            console.log("Pending")
        })
        builder.addCase(getAllProducts.rejected,()=>{
            console.log("Rejected")
        })
        builder.addCase(getAllProducts.fulfilled,(state,action)=>{
            console.log("fulfilled")
            state.products= action.payload
        })
    }
})

export const productsReducer = productsSlice.reducer;
