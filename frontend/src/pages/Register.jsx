import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Loader2, UserPlus, Lock, Mail, User } from 'lucide-react';
import { api } from '../services/api';

export const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'Editor' // Default role for public registration could be restricted, but for demo we allow it
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu nhập lại không khớp');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.auth.register({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: formData.role
      });
      setSuccess(true);
      setTimeout(() => {
        // Option to log them in directly or redirect to home/login
        navigate('/');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#070913',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Decor */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        right: '-10%',
        width: '60vw',
        height: '60vw',
        background: 'radial-gradient(circle, rgba(2, 132, 199, 0.15) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(80px)',
        zIndex: 0
      }}></div>

      <div style={{ position: 'relative', zIndex: 1, padding: '24px' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#94a3b8', textDecoration: 'none' }}>
          <ArrowLeft size={16} /> Quay lại trang chủ
        </Link>
      </div>

      <div className="flex-center" style={{ flex: 1, position: 'relative', zIndex: 1, padding: '20px' }}>
        <div className="glass-panel" style={{
          maxWidth: '480px',
          width: '100%',
          padding: '40px',
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <UserPlus size={28} color="white" />
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>Tạo Tài Khoản</h2>
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>Tham gia mạng lưới quản trị Celestia Tourism</p>
          </div>

          {success ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <ShieldCheck size={48} style={{ color: '#10b981', margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', color: '#10b981' }}>Đăng ký thành công!</h3>
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>Tài khoản của bạn đã được tạo. Hệ thống sẽ tự động chuyển hướng...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {error && (
                <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', color: '#fca5a5', fontSize: '14px' }}>
                  {error}
                </div>
              )}

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}><User size={14} /> Họ và Tên</label>
                <input 
                  type="text" 
                  required
                  className="form-input" 
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                  placeholder="Nhập họ và tên..."
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}><Mail size={14} /> Địa chỉ Email</label>
                <input 
                  type="email" 
                  required
                  className="form-input" 
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="name@domain.com"
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}><Lock size={14} /> Mật khẩu</label>
                <input 
                  type="password" 
                  required
                  className="form-input" 
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}><Lock size={14} /> Xác nhận mật khẩu</label>
                <input 
                  type="password" 
                  required
                  className="form-input" 
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  value={formData.confirmPassword}
                  onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                  placeholder="••••••••"
                />
              </div>

              <div className="form-group">
                <label style={{ color: '#cbd5e1' }}>Vai trò (Demo only)</label>
                <select 
                  className="form-input" 
                  style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                >
                  <option value="Editor">Biên Tập Viên (Editor)</option>
                  <option value="Admin">Quản Trị Viên (Admin)</option>
                </select>
                <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>*Trong thực tế, việc tạo tài khoản Admin sẽ yêu cầu mã phân quyền.</span>
              </div>

              <button 
                type="submit" 
                className="action-button primary" 
                style={{ width: '100%', padding: '14px', marginTop: '10px', fontSize: '16px', fontWeight: 'bold' }}
                disabled={loading}
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : 'Đăng Ký Ngay'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
