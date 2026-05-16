import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './index.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import GoalsPage from './pages/GoalsPage';
import ApprovalsPage from './pages/ApprovalsPage';
import CheckinsPage from './pages/CheckinsPage';
import ReportsPage from './pages/ReportsPage';
import AuditLogsPage from './pages/AuditLogsPage';

function RoleRoute({ roles, children }) { const { user } = useAuth(); return roles.includes(user.role) ? children : <Navigate to="/" replace />; }
function App(){ return <BrowserRouter><AuthProvider><Routes><Route path="/login" element={<LoginPage/>}/><Route path="/" element={<ProtectedRoute><Layout/></ProtectedRoute>}><Route index element={<Dashboard/>}/><Route path="goals" element={<RoleRoute roles={['employee']}><GoalsPage/></RoleRoute>}/><Route path="approvals" element={<RoleRoute roles={['manager']}><ApprovalsPage/></RoleRoute>}/><Route path="checkins" element={<RoleRoute roles={['employee','manager']}><CheckinsPage/></RoleRoute>}/><Route path="reports" element={<RoleRoute roles={['manager','admin']}><ReportsPage/></RoleRoute>}/><Route path="audit" element={<RoleRoute roles={['admin']}><AuditLogsPage/></RoleRoute>}/></Route></Routes></AuthProvider></BrowserRouter> }

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
