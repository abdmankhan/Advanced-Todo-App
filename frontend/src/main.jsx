import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <GoogleOAuthProvider clientId="264065705232-p9gq4o2duvi9v1dlt35o05fl85pd0c2s.apps.googleusercontent.com"> */}
      <App />
    {/* </GoogleOAuthProvider> */}
  </StrictMode>
);
