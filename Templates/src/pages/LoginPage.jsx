import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User, ArrowRight, Mountain } from 'lucide-react';
import axiosClient from '../api/axiosClient';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const result = await login(email, password);
        if (result.success) {
          if (result.role === 'Admin' || result.role === 'Editor') {
            navigate('/admin');
          } else {
            navigate('/'); // Du khách thì quay về trang chủ
          }
        } else {
          setError(result.message);
        }
      } else {
        // Register Logic
        const response = await axiosClient.post('/auth/register', { email, password, fullName });
        if (response) {
          setIsLogin(true);
          setError('Đăng ký thành công! Vui lòng đăng nhập.');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1920&q=80')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

      {/* Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-md p-8 bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50">
        
        {/* Logo/Brand */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="bg-primary p-3 rounded-full mb-3 shadow-lg">
            <Mountain className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Celestia</h1>
          <p className="text-sm text-gray-600 mt-1 font-medium">Khám phá vẻ đẹp Việt Nam</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`p-3 rounded-lg mb-6 text-sm font-medium ${error.includes('thành công') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Họ và Tên</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary sm:text-sm bg-white/90 transition-shadow shadow-sm hover:shadow-md"
                  placeholder="Nhập họ và tên..."
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary sm:text-sm bg-white/90 transition-shadow shadow-sm hover:shadow-md"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mật khẩu</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary sm:text-sm bg-white/90 transition-shadow shadow-sm hover:shadow-md"
                placeholder="••••••••"
              />
            </div>
          </div>

          {isLogin && (
            <div className="flex items-center justify-end">
              <a href="#" className="text-sm font-medium text-primary hover:text-teal-700 transition-colors">
                Quên mật khẩu?
              </a>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-primary hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 transform hover:scale-[1.02]"
          >
            {isLoading ? 'Đang xử lý...' : (isLogin ? 'Đăng Nhập' : 'Đăng Ký')}
            {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-700 font-medium">
            {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-bold text-primary hover:text-teal-700 underline decoration-2 underline-offset-4 transition-colors"
            >
              {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
