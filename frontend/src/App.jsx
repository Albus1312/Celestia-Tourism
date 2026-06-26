import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { LandingPage } from './pages/LandingPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { CommunityPage } from './pages/CommunityPage';
import { Register } from './pages/Register';
import { ShieldAlert, Compass, LogIn } from 'lucide-react';
import './index.css';

// Protected Route Wrapper for Admin Access
const ProtectedRoute = ({ children, allowedRoles = ['Admin', 'Editor'] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '80vh', color: 'white' }}>
        <Compass className="spin" size={32} style={{ animation: 'spin 1.5s linear infinite' }} />
      </div>
    );
  }

  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    // If not authenticated or role not allowed, render a visually stunning access warning rather than raw redirect
    return (
      <div className="flex-center" style={{ minHeight: '80vh', padding: '24px', background: '#070913', color: 'white', marginTop: '8px' }}>
        <div className="glass-panel" style={{
          maxWidth: '500px',
          width: '100%',
          borderRadius: '20px',
          padding: '40px',
          textAlign: 'center',
          border: '1px solid rgba(239, 68, 68, 0.15)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
        }}>
          <ShieldAlert size={48} style={{ color: '#ef4444', marginBottom: '20px' }} />
          <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px' }}>Không Có Quyền Truy Cập</h3>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '28px', lineHeight: '1.6' }}>
            {!user 
              ? 'Phân hệ Quản trị / Thiết kế Visual Page Builder yêu cầu đăng nhập bằng tài khoản của Ban Quản Trị hoặc Biên Tập Viên.'
              : 'Tài khoản của bạn không có thẩm quyền truy cập phân hệ Quản trị / Thiết kế Visual Page Builder.'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button 
              onClick={() => {
                // Force logout and redirect
                localStorage.removeItem('celestia_token');
                localStorage.removeItem('celestia_user');
                window.location.href = '/';
              }} 
              className="btn btn-primary"
            >
              <LogIn size={14} /> Đăng Nhập Tài Khoản Khác
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          
          <div style={{ marginTop: '80px', flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/landingpage/:id" element={<LandingPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>

          <footer style={{
            background: 'var(--bg-app)',
            borderTop: '1px solid var(--border-color)',
            padding: '24px 0',
            textAlign: 'center',
            fontSize: '13px',
            color: 'var(--text-secondary)'
          }}>
            <div className="container">
              <p>© {new Date().getFullYear()} Celestia.vn - Hệ Thống Trình Diễn & Lập Bản Đồ Du Lịch Việt Nam.</p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                Phát triển phục vụ báo cáo tiến độ kỹ thuật. Đã tích hợp PostgreSQL 18 & Entity Framework Core.
              </p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
