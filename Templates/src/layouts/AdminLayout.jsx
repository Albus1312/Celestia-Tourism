import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Mountain,
  UserCircle,
  LayoutList,
  Compass,
  Users,
  Building
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

    const navItems = [
      { path: '/admin', icon: LayoutDashboard, label: 'Bảng Điều Khiển' },
      { path: '/admin/destinations', icon: Map, label: 'Địa Điểm' },
      { path: '/admin/categories', icon: LayoutList, label: 'Danh Mục' },
      { path: '/admin/tours', icon: Compass, label: 'Gói Tour' },
      { path: '/admin/services', icon: Building, label: 'Dịch Vụ' },
      { path: '/admin/bookings', icon: FileText, label: 'Đặt Tour/Dịch vụ' },
      { path: '/admin/articles', icon: FileText, label: 'Bài Viết eMagazine' },
      { path: '/admin/feedback', icon: Users, label: 'Đánh giá & Phản hồi' },
      { path: '/admin/social', icon: Users, label: 'Mạng Xã Hội' },
    ];

  if (user?.role === 'Admin') {
    navItems.push({ path: '/admin/users', icon: UserCircle, label: 'Quản lý Người dùng' });
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside 
        className={`bg-surface border-r border-gray-200 w-64 flex-shrink-0 transition-transform duration-300 ease-in-out z-20 
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          fixed md:relative h-full flex flex-col shadow-sm`}
      >
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100 bg-white">
          <Mountain className="text-primary w-6 h-6 mr-2" />
          <span className="text-xl font-bold text-gray-800 tracking-tight">Celestia<span className="text-primary">Admin</span></span>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="ml-auto md:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-primary/10 text-primary shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer (Logout) */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3 text-red-500" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-surface border-b border-gray-200 z-10 shadow-sm">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg p-1 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-bold text-gray-700">{user?.fullName || 'Administrator'}</span>
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-0.5">
                {user?.role || 'Admin'}
              </span>
            </div>
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-md border-2 border-white">
              <UserCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-background p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
