import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext-clean';
import ProtectedRoute from './components/ProtectedRoute-clean';
import ErrorBoundary from './components/ErrorBoundary';

// Import page components
import LoginPage from './pages/LoginPage-clean';
import RegisterPage from './pages/RegisterPage-clean';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import ProfilePage from './pages/ProfilePage';
import AddProjectPage from './pages/AddProjectPage';
import ProjectDetail from './pages/ProjectDetail';
import EditProjectPage from './pages/EditProjectPage';
import Tasks from './pages/Tasks';
import Analytics from './pages/Analytics';
import KanbanBoard from './pages/KanbanBoard';
import Sprints from './pages/Sprints';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              
              <Route path="/projects/new" element={
                <ProtectedRoute>
                  <AddProjectPage />
                </ProtectedRoute>
              } />

              <Route path="/projects/:id" element={
                <ProtectedRoute>
                  <ProjectDetail />
                </ProtectedRoute>
              } />

              <Route path="/projects/:id/edit" element={
                <ProtectedRoute>
                  <EditProjectPage />
                </ProtectedRoute>
              } />
              
              <Route path="/projects" element={
                <ProtectedRoute>
                  <ProjectsPage />
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />

              <Route path="/tasks" element={
                <ProtectedRoute>
                  <Tasks />
                </ProtectedRoute>
              } />

              <Route path="/analytics" element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } />

              <Route path="/kanban" element={
                <ProtectedRoute>
                  <KanbanBoard />
                </ProtectedRoute>
              } />

              <Route path="/sprints" element={
                <ProtectedRoute>
                  <Sprints />
                </ProtectedRoute>
              } />
              
              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* 404 fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
    </ErrorBoundary>
  );
}

export default App;
