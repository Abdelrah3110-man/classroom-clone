import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Home'
import ClassDetails from './pages/ClassDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import CreateAssignment from './pages/CreateAssignment'
import AssignmentDetails from './pages/AssignmentDetails'
import EditAssignment from './pages/EditAssignment'
import CreateMaterial from './pages/CreateMaterial'
import MaterialDetails from './pages/MaterialDetails'
import EditMaterial from './pages/EditMaterial'
import EditClassroom from './pages/EditClassroom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { useAuth } from './context/AuthContext'

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const { user } = useAuth();

  return (
    <div className="app min-h-screen flex flex-col">
      {user && <Navbar />}
      <main className={`${user ? "container mx-auto" : ""} flex-grow`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/class/:id" element={<PrivateRoute><ClassDetails /></PrivateRoute>} />
          <Route path="/class/:id/edit" element={<PrivateRoute><EditClassroom /></PrivateRoute>} />
          <Route path="/class/:id/assignments/create" element={<PrivateRoute><CreateAssignment /></PrivateRoute>} />
          <Route path="/class/:id/assignments/:assignmentId" element={<PrivateRoute><AssignmentDetails /></PrivateRoute>} />
          <Route path="/class/:id/assignments/:assignmentId/edit" element={<PrivateRoute><EditAssignment /></PrivateRoute>} />
          <Route path="/class/:id/materials/create" element={<PrivateRoute><CreateMaterial /></PrivateRoute>} />
          <Route path="/class/:id/materials/:materialId" element={<PrivateRoute><MaterialDetails /></PrivateRoute>} />
          <Route path="/class/:id/materials/:materialId/edit" element={<PrivateRoute><EditMaterial /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
