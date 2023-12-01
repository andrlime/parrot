"use client";
import App from '@parrot/components/App';
import { Provider } from 'react-redux';
import store, { persistor } from '@parrot/store/reducer';
import { PersistGate } from 'redux-persist/integration/react';

export default function Home() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App/>
      </PersistGate>
    </Provider>
  )
}
