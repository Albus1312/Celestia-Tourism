import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mountain, UserCircle, LogOut, Settings, Calendar, ChevronDown, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white/80 backdrop-blur-md fixed w-full z-50 top-0 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Mountain className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-bold text-gray-900 tracking-tight">Celestia</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-900 font-medium hover:text-primary transition-colors">Trang chủ</Link>
            <Link to="/destinations" className="text-gray-500 font-medium hover:text-primary transition-colors">Địa điểm</Link>
            <Link to="/tours" className="text-gray-500 font-medium hover:text-primary transition-colors">Đặt Tour</Link>
            <Link to="/services" className="text-gray-500 font-medium hover:text-primary transition-colors">Dịch vụ</Link>
            <Link to="/emagazine" className="text-gray-500 font-medium hover:text-primary transition-colors">eMagazine</Link>
            <Link to="/social" className="text-gray-500 font-medium hover:text-primary transition-colors">Cộng đồng</Link>
          </div>
          <div>
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none bg-gray-50 hover:bg-gray-100 rounded-full py-1.5 px-2 transition-colors border border-gray-200"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-sm">
                    <UserCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 hidden sm:block">
                    {user.fullName?.split(' ')[0] || user.email?.split('@')[0]}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transform opacity-100 scale-100 transition-all origin-top-right">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                      <p className="text-sm font-bold text-gray-900 truncate">{user.fullName || user.email}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                    </div>
                    
                    <div className="py-2">
                      <Link 
                        to="/profile" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                      >
                        <Settings className="w-4 h-4 mr-3 text-gray-400" />
                        Thông tin tài khoản
                      </Link>
                      <Link 
                        to="/itinerary" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                      >
                        <Calendar className="w-4 h-4 mr-3 text-gray-400" />
                        Thẻ lịch trình
                      </Link>
                      
                      {(user.role === 'Admin' || user.role === 'Editor') && (
                        <Link 
                          to="/admin" 
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center px-4 py-2.5 text-sm font-medium text-secondary hover:bg-teal-50 transition-colors"
                        >
                          <Shield className="w-4 h-4 mr-3 text-secondary/70" />
                          Trang quản trị
                        </Link>
                      )}
                    </div>
                    
                    <div className="border-t border-gray-100 py-2">
                      <button 
                        onClick={() => { logout(); setIsDropdownOpen(false); }}
                        className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3 text-red-500" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium text-sm">Đăng nhập</Link>
                <Link to="/login" className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-primary hover:bg-teal-700 transition-colors">
                  Bắt đầu
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
