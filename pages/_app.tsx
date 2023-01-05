import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {Provider} from "react-redux";
import store from "../src/store/store";
import {persistStore} from "redux-persist";
import {PersistGate} from "redux-persist/integration/react";

export default function App({Component, pageProps}: AppProps) {
  const persistor = persistStore(store)
  return <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Component {...pageProps} />
    </PersistGate>
  </Provider>
}
