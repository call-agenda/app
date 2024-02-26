import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './app'
import './index.css'

import { GoogleOAuthProvider } from '@react-oauth/google';
import { env } from './env';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={env.VITE_GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
