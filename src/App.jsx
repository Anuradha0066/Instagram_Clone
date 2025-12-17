import React from 'react'
import Login from './Login'
import SignUp from './SignUp'
import { Route, Routes, Navigate } from 'react-router-dom'
import MainPage from './MainPage'
import Upload from './Upload'
import Search from './Search'
import Profile from './Profile'
import { AuthProvider, useAuth } from './context/AuthContext'
import FetchImages from './FetchImages'
import UserProfile from './UserProfile'
// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  
  if (!user) {
    return <Navigate to="/login" />
  }

  return children
}

const AppRoutes = () => {
  const { user } = useAuth()

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={user ? <Navigate to="/home" /> : <Login />} 
      />
      <Route 
        path="/signup" 
        element={user ? <Navigate to="/home" /> : <SignUp />} 
      />

      {/* Protected Routes */}
      <Route
        path="/home"
        element={
          // <ProtectedRoute>
            <MainPage />
          // </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <Search />
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload"
        element={
           <ProtectedRoute>
            <Upload />
           </ProtectedRoute>
        }
      />

       <Route
        path="/fetch"
        element={
          // <ProtectedRoute>
            <FetchImages />
          // </ProtectedRoute>
        }
      />

      <Route
  path="/profile"
  element={
    // <ProtectedRoute>
      <Profile /> 
    // </ProtectedRoute>
  }
/>

<Route
  path="/profile/:username"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>
 
        <Route path="/user/:name" element={<UserProfile />} />
      

      {/* Redirect root to login or home based on auth status */}
      <Route
        path="/"
        element={<Navigate to={user ? "/home" : "/login"} />}
      />

    </Routes>
  )
}

const App = () => {
  return (
    <AuthProvider>
      <div className="bg-[#121212] min-h-screen">
        <AppRoutes />
      </div>
    </AuthProvider>
  )
}

export default App
