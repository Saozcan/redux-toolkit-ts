This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.





## Redux Toolkit Kullanımı

Basit olarak RTK iki basit işlemle çalışmaktadır. Bunlardan biri işlemlerin gerçekleşeceği slice böylesi
diğer dataların tutulacağı ve export edileceği store bilgesi.

---

Öncelikle 
```
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
  
  export default counterSlice.reducer; //todos dışayıra default ediliyor.

  ```

üstte görüldüğü üzere feature dosyası adı altında authSlice.ts dosyası oluşturularak yapı oluşturulur.
Her bir işlem için ayrı ayrı Slice tutmak daha temiz olacaktır.
İçinde bulunan kısımlar sırasıyla;
- name : özellikle thunk işlemi için çok önemli
- initialState: başlangıç değeri,
- reducers: senkron işlemler
- extraReducers: asenkron işlemleri pending, rejected ve fulfilled adımları (thunk kısmında anlatılacak).
---

Takibinde store klasöründe store.ts dosyasını açabiliriz.
```
import counterSlice from "../features/todoSlice";


const store = configureStore({
  reducer: {
    counter: counterSlice,
  },
})

export type RootState = ReturnType<typeof store.getState> // store type alınıp otomatik olarka rootstate e eklenir,
    //global state için kullanılır
    //reducer içine giren type lar otomatik olarak alınıp rootstate e ekleniyor

export type AppDispatch = typeof store.dispatch;

    //Hookların typelı halleri
export const useAppDispatch = () => useDispatch<AppDispatch>(); //böylede usedispatch her kullanımında type kullanmaya
    //gerek kalmayacak

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```
todoSlice dosyasından export edilen reducerlar store dosyasında reducer kısmında isim isim olacak
şekilde tutulacaktır. Ts kullanıcıları için bir kaç type export etmek işi çok kolaylaştıracaktır. 
Böylece her seferinde tekrar type çağırma işlemi engellenebilir.


---

Uygulama öncesi kullanılacak componentler provider ile sarılmalıdır.
```
import store from "../src/store/store";
import {Provider} from "react-redux";

export default function App({Component, pageProps}: AppProps) {
  const persistor = persistStore(store)
  return <Provider store={store}>
      <Component {...pageProps} />
  </Provider>
}
```

---
Component içinde kullanılacağı zaman
```
import {useAppDispatch, useAppSelector} from "../../src/store/store";

 const auth = useAppSelector((state) => state.persistedReducer.auth);
 const dispatch = useAppDispatch();
 
 return (
 <>
          <button onClick={() => dispatch(increment())}>increment</button>
          <button onClick={() => dispatch(decrement())}>decrement</button>
          <div><span>Counter</span><span>: {counter.count}</span></div>
 </>
 )
```

---
## Thunk işlemleri
Asenkron işlemleri için kullanılacaktır.
```
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
```
3 durumu mevcut;
- Pending: asenkron işleminin başladığı ve henüz bitmediği durum
- fulfilled: İşlemin normal bir şekilde sonlandığı
- rejected: Hata ile sonlandığı

Bu 3 bölge için değişimler Slice içinde bulunan extraReducer kısmında gerçekleşir
```
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
```
Her case durumu için farklı atamalar yapılarak programda istenilenler sunulur.
Örnek vermek gerekirse, login anı tamamlanana kadar state.isPending kısmı true getirilerek
kullanıcıya spin animasyonu gösterilebilir.
Takibinde fulfilled yada rejected durumlarına göre stateler güncellenerek yapılmak istenen işlem
gerçekleştirilir.
```
   className={`${auth.isPending ? "bg-red-600" : "bg-white"} text-black`}
```

Hata durumunda thunkAPI.rejectwithvalue kullanılmalıdır.

---
## Persist işlemleri (Cache)
Her seferinde kullanıcıdan tekrar tekrar login almamak için verileri LocalStorage içinde tutabiliriz
Bunun için Redux'ın diğer bir özelliği olan Persist kullanılabilir.

```
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
  },
})
```

Store içinde reducer işlemine Slice'ı almadan persist ile sarmallamalıyız.

Takibinde 
```
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
```

Cache işleminin saracağı component ağına provider gibi işlem uygulanır.

Saklanmasını istenmeyen veriler için config içinde blacklist kullanılabilir.
```
const authPersistConfig = {
  key: 'auth',
  storage,
  blacklist: ['errorMessage', 'isPending'],
}
```




















