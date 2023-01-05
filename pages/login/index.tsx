import {FormEvent, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../src/store/store";
import {login, logout} from "../../src/features/loginSlice";


export default function Index() {

  const auth = useAppSelector((state) => state.persistedReducer.auth);
  const dispatch = useAppDispatch();


  const onSubmit = (async (e: any) => {
    e.preventDefault();
    const user = await dispatch(login("123123"))
  })

  console.log(auth)

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="username">Username</label>
        <input type="text" id="username" placeholder="Username"/>
        <button
c          type="submit">Login
        </button>
      </form>
      <span>{auth.error}</span>
      <button onClick={() => {dispatch(logout("123123"))}}>Logout</button>
    </div>

  )
}