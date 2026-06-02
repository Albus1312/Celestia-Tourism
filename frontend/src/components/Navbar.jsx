import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, LogOut, LayoutDashboard, Home, User, ShieldAlert, X } from 'lucide-react';

export const Navbar = () => {
  const { user, login, logout, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [scrolled, setScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
      setShowLoginModal(false);
      setUsername('');
      setPassword('');
    } catch (err) {
      setError(err.message || 'Tên đăng nhập hoặc mật khẩu sai!');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await register(username, password, fullName, email);
      setSuccess('Đăng ký tài khoản thành công! Đang chuyển sang đăng nhập...');
      setTimeout(() => {
        setIsRegisterMode(false);
        setSuccess('');
        setPassword('');
        setError('');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại! Vui lòng thử lại.');
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setError('');
    setSuccess('');
  };

  const closeAuthModal = () => {
    setShowLoginModal(false);
    setIsRegisterMode(false);
    setError('');
    setSuccess('');
    setUsername('');
    setPassword('');
    setFullName('');
    setEmail('');
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <Link to="/" className="logo-container">
            <div className="logo-logo">C</div>
            <div className="logo-text">Celestia<span>.vn</span></div>
          </Link>

          <ul className="nav-links">
            <li>
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                <Home size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                Trang Chủ
              </Link>
            </li>
            {user && (
              <li>
                <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>
                  <LayoutDashboard size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                  Dashboard QL
                </Link>
              </li>
            )}
          </ul>

          <div className="nav-auth">
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '14px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={14} />
                  Hi, <strong>{user.fullName}</strong> ({user.role})
                </span>
                <button onClick={logout} className="btn btn-logout">
                  <LogOut size={14} />
                  Đăng Xuất
                </button>
              </div>
            ) : (
              <button onClick={() => setShowLoginModal(true)} className="btn btn-primary">
                <LogIn size={14} />
                Đăng Nhập Quản Trị
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Modern Glassmorphic Login / Register Modal */}
      {showLoginModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(2, 4, 12, 0.85)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '450px',
            borderRadius: '24px',
            padding: '36px',
            position: 'relative',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.6)'
          }}>
            <button 
              onClick={closeAuthModal}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                color: '#64748b',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div className="logo-logo" style={{ margin: '0 auto 16px auto', width: '48px', height: '48px', fontSize: '24px' }}>C</div>
              <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '6px', fontFamily: 'Outfit, sans-serif' }}>
                {isRegisterMode ? 'Đăng Ký Du Khách' : 'Hệ Thống Celestia'}
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b' }}>
                {isRegisterMode ? 'Tạo tài khoản cá nhân để chia sẻ và đánh giá' : 'Đăng nhập tài khoản Quản trị / Biên tập viên'}
              </p>
            </div>

            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '10px',
                padding: '12px 16px',
                color: '#f87171',
                fontSize: '13px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <ShieldAlert size={16} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div style={{
                background: 'rgba(34, 197, 94, 0.08)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                borderRadius: '10px',
                padding: '12px 16px',
                color: '#4ade80',
                fontSize: '13px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <ShieldAlert size={16} style={{ color: '#4ade80' }} />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={isRegisterMode ? handleRegisterSubmit : handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {isRegisterMode && (
                <>
                  <div className="form-group">
                    <label>Họ và Tên</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nhập tên đầy đủ của bạn..." 
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@gmail.com" 
                      required
                    />
                  </div>
                </>
              )}

              <div className="form-group">
                <label>Tên đăng nhập</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={isRegisterMode ? "Chọn tên tài khoản..." : "admin hoặc editor"} 
                  required
                />
              </div>

              <div className="form-group">
                <label>Mật khẩu</label>
                <input 
                  type="password" 
                  className="form-input" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu..." 
                  required
                />
              </div>

              {!isRegisterMode && (
                <div style={{ fontSize: '11px', color: '#64748b', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.06)' }}>
                  💡 <strong>Gợi ý demo đồ án:</strong>
                  <ul style={{ paddingLeft: '14px', marginTop: '4px' }}>
                    <li>Tài khoản: <code>admin</code> / Mật khẩu: <code>admin123</code> (Admin)</li>
                    <li>Tài khoản: <code>editor</code> / Mật khẩu: <code>editor123</code> (Editor)</li>
                  </ul>
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', borderRadius: '12px', fontWeight: '700' }}>
                {isRegisterMode ? 'Hoàn Tất Đăng Ký' : 'Xác Nhận Đăng Nhập'}
              </button>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#94a3b8' }}>
              {isRegisterMode ? (
                <span>
                  Đã có tài khoản?{' '}
                  <button onClick={toggleMode} style={{ color: '#38bdf8', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
                    Đăng nhập ngay
                  </button>
                </span>
              ) : (
                <span>
                  Chưa có tài khoản?{' '}
                  <button onClick={toggleMode} style={{ color: '#38bdf8', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
                    Đăng ký du khách
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
