import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import sleep from "../sleep/sleep";


export interface LoginType {
  username: string | null;
  isPending: boolean;
  error: any;
  isAuthenticated: boolean;
  token: string;
}

const initialState: LoginType = {
  username: '',
  isPending: false,
  isAuthenticated: false,
  token: "",
  error: "",
}

export const login = createAsyncThunk(
  "auth/login",
  async (request?: any, thunkAPI?) => {
    try {
      await sleep(1000);
      //throw "Error";
    }
    catch (e: any) {
      return thunkAPI.rejectWithValue(e);
    }
  }
)

export const logout = createAsyncThunk(
  "auth/logout",
  async (request?: any, thunkAPI?) => {
    try {
      console.log(request)
      return;
    }
    catch (e: any) {
      return thunkAPI.rejectWithValue(e);
    }
  }
)


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
      state.isPending = true;
      state.error = undefined;
    })
      .addCase(login.fulfilled,(state)=> {
        state.isPending = false;
        state.isAuthenticated = true;
        state.token = "TokenDoldu";
      })
      .addCase(login.rejected, (state, action) => {
        state.isPending = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        console.log("infulfilled logout");
        state.token = "";
      })
  }
})

export default authSlice.reducer
