import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { createTheme } from './theme';
import AppRoutes from './routes/AppRoutes';
import { FirebaseOptions, initializeApp } from 'firebase/app';
import { Provider } from 'react-redux';
import { persistor, store } from './state/store';
import './localization/config';
import { SnackbarProvider } from 'notistack';
import { PersistGate } from 'redux-persist/integration/react';

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

// Initialize Firebase
initializeApp(firebaseConfig);

const theme = createTheme();

const App = (): React.ReactElement => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </SnackbarProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
