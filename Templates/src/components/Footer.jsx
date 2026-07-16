import React from 'react';
import { Mountain } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="flex items-center mb-6 md:mb-0">
            <Mountain className="h-10 w-10 text-primary" />
            <span className="ml-3 text-3xl font-bold tracking-tight">Celestia</span>
          </div>
          <div className="flex space-x-6 text-gray-400">
            <a href="#" className="hover:text-primary transition-colors">Về chúng tôi</a>
            <a href="#" className="hover:text-primary transition-colors">Điều khoản</a>
            <a href="#" className="hover:text-primary transition-colors">Bảo mật</a>
            <a href="#" className="hover:text-primary transition-colors">Liên hệ</a>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>© 2026 Celestia Travel. Đồ án môn học.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
