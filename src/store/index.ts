import {configureStore} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux"
import todoSlice from "../features/todoSlice";

const store = configureStore({
    reducer: {
        todos: todoSlice,
    }
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