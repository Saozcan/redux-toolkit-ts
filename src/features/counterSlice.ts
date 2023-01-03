import {createSlice, PayloadAction} from "@reduxjs/toolkit";


export interface CounterType {
  count: number;
}

const initialState: CounterType = {
  count: 0
}

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.count += 1
    },
    decrement: (state) => {
      state.count -= 1;
    }
  }
})

export default counterSlice.reducer;
export const {increment, decrement} = counterSlice.actions;
