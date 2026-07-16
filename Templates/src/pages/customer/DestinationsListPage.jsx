import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { MapPin, Search, Mountain, Loader2 } from 'lucide-react';
import Navbar from '../../components/Navbar';

const DestinationsListPage = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const data = await axiosClient.get('/destinations');
      setDestinations(data);
    } catch (error) {
      console.error('Lỗi tải danh sách địa điểm:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDestinations = destinations.filter(dest => 
    dest.isActive && dest.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 font-sans">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-teal-50 rounded-2xl mb-4">
            <Mountain className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            Khám phá <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Điểm đến</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hàng ngàn địa điểm du lịch hấp dẫn trên khắp Việt Nam đang chờ bạn khám phá. Hãy chọn một điểm đến để bắt đầu hành trình của mình.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm địa điểm (VD: Đà Lạt, Hạ Long...)"
              className="block w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm transition-shadow hover:shadow-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Grid Container */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : filteredDestinations.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy địa điểm</h3>
            <p className="text-gray-500">Rất tiếc, chúng tôi không tìm thấy địa điểm nào khớp với "{searchTerm}".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDestinations.map((dest) => (
              <Link 
                key={dest.id} 
                to={`/destination/${dest.id}`}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full transform hover:-translate-y-1"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  {dest.coverImageUrl ? (
                    <img 
                      src={dest.coverImageUrl} 
                      alt={dest.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Mountain className="w-10 h-10 text-gray-400" />
                    </div>
                  )}
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80" />
                  
                  {/* Category Badge */}
                  {dest.category && (
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-white/90 backdrop-blur-sm text-gray-900 shadow-sm uppercase tracking-wide">
                        {dest.category.name}
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1 truncate drop-shadow-md">
                      {dest.name}
                    </h3>
                    <div className="flex items-center text-gray-200 text-sm font-medium">
                      <MapPin className="w-4 h-4 mr-1 text-primary" />
                      {dest.province ? dest.province.name : 'Việt Nam'}
                    </div>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-4">
                    {dest.description || "Khám phá vẻ đẹp tuyệt vời và những trải nghiệm độc đáo tại địa điểm này cùng Celestia."}
                  </p>
                  <div className="flex items-center text-primary font-semibold text-sm group-hover:text-teal-700 transition-colors">
                    Khám phá ngay
                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default DestinationsListPage;
