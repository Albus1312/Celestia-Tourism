import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { UserCircle, Mail, Shield, Save, Key, X } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { showToast, confirmAction } from '../../utils/alertUtils';

const ProfilePage = () => {
  const { user } = useAuth();
  
  // Fake state for form
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: '0987654321', // Dummy data since backend auth might not have phone yet
    address: 'Hà Nội, Việt Nam'
  });
  const [isEditing, setIsEditing] = useState(false);

  // Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        fullName: user.fullName || ''
      });
    }
  }, [user]);

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    showToast('Cập nhật thông tin thành công!', "success");
    // Ideally this would call a PUT API to update user profile
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Mật khẩu xác nhận không khớp.');
      return;
    }

    try {
      setIsChangingPassword(true);
      await axiosClient.post('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      showToast('Đổi mật khẩu thành công!', "success");
      setIsPasswordModalOpen(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error(error);
      setPasswordError(error.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-4 max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Hồ Sơ Cá Nhân</h1>
          <p className="text-gray-500 mt-2">Quản lý thông tin tài khoản và bảo mật của bạn.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-secondary h-32 relative">
            <div className="absolute -bottom-12 left-8">
              <div className="h-24 w-24 rounded-full bg-white p-1 shadow-md">
                <div className="h-full w-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  <UserCircle className="h-20 w-20 text-gray-400 mt-4" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-16 px-8 pb-8">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user?.fullName || 'Người Dùng'}</h2>
                <div className="flex items-center mt-2 text-gray-500 space-x-4 text-sm">
                  <span className="flex items-center"><Mail className="w-4 h-4 mr-1" /> {user?.email}</span>
                  <span className="flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                    <Shield className="w-4 h-4 mr-1" /> {user?.role || 'Traveler'}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                  isEditing ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-primary text-white hover:bg-teal-700'
                }`}
              >
                {isEditing ? 'Hủy bỏ' : 'Chỉnh sửa Hồ Sơ'}
              </button>
            </div>

            <hr className="border-gray-100 mb-8" />

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                  <input 
                    type="text" 
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email (Không thể thay đổi)</label>
                  <input 
                    type="email" 
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-xl text-gray-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                  <input 
                    type="text" 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary sm:text-sm disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
                  />
                </div>
              </div>
              
              {isEditing && (
                <div className="pt-4 flex justify-end">
                  <button type="submit" className="flex items-center px-6 py-3 bg-secondary text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-md">
                    <Save className="w-5 h-5 mr-2" />
                    Lưu Thay Đổi
                  </button>
                </div>
              )}
            </form>

            <div className="mt-12 pt-8 border-t border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Key className="w-5 h-5 mr-2 text-gray-400" />
                Bảo mật
              </h3>
              <button 
                onClick={() => setIsPasswordModalOpen(true)}
                className="text-sm font-medium text-primary hover:text-teal-700 transition-colors"
              >
                Đổi mật khẩu
              </button>
            </div>

          </div>
        </div>
      </main>

      {/* Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Đổi Mật Khẩu</h3>
              <button onClick={() => setIsPasswordModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              {passwordError && (
                <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
                  {passwordError}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
                <input 
                  type="password" 
                  required
                  value={passwordForm.currentPassword}
                  onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary text-sm"
                  placeholder="••••••••"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                <input 
                  type="password" 
                  required
                  minLength={6}
                  value={passwordForm.newPassword}
                  onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary text-sm"
                  placeholder="Ít nhất 6 ký tự"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
                <input 
                  type="password" 
                  required
                  value={passwordForm.confirmPassword}
                  onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary text-sm"
                  placeholder="Nhập lại mật khẩu mới"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button 
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  disabled={isChangingPassword}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-primary hover:bg-teal-700 rounded-xl transition-colors disabled:opacity-70 flex items-center"
                >
                  {isChangingPassword ? 'Đang đổi...' : 'Cập nhật Mật khẩu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProfilePage;
