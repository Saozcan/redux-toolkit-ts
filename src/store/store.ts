import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux"
import todoSlice from "../features/todoSlice";
import counterSlice from "../features/counterSlice";
import authSlice from "../features/loginSlice";
import {persistReducer} from "redux-persist"
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";


const persistConfig = {
  key: "auth",
  storage,
}

const persistedReducer = combineReducers({
  auth: persistReducer(persistConfig, authSlice),
})

const store = configureStore({
  reducer: {
    persistedReducer,
    todos: todoSlice, //çağırılırken burdan çağırma işlemi kullanılacak.
    counter: counterSlice, //çağırılırken burdan çağırma işlemi kullanılacak.
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk],
})


export default store

export type RootState = ReturnType<typeof store.getState> // store type alınıp otomatik olarka rootstate e eklenir,
//global state için kullanılır
//reducer içine giren type lar otomatik olarak alınıp rootstate e ekleniyor

export type AppDispatch = typeof store.dispatch;

//Hookların typelı halleri
export const useAppDispatch = () => useDispatch<AppDispatch>(); //böylede usedispatch her kullanımında type kullanmaya
//gerek kalmayacak

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
//eski hali const todos = useSelector((state: RootState) =>)... üstteki sayesinde artık ihtiyaç kalmayacak