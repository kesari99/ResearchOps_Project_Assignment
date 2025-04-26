import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './context/auth-context'
import AdminProvider from './context/admin-context'
import UserProvider from './context/user-context'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AdminProvider>
 
  <AuthProvider>
    <UserProvider>
  
    <App />
    </UserProvider>
  </AuthProvider>
  </AdminProvider>
  </BrowserRouter>
)
