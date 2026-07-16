import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { Building, MapPin, Search, Filter } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const ServicesListPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  
  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 6;

  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await axiosClient.get('/LocalServices');
      setServices(data.filter(s => s.isActive !== false)); // Lấy dịch vụ đang mở bán
    } catch (error) {
      console.error('Lỗi khi tải Dịch vụ:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (s.destination?.name && s.destination.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'All' || s.type === filterType;
    return matchesSearch && matchesType;
  });

  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService);
  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-4 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Dịch Vụ Địa Phương</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trải nghiệm văn hóa bản địa qua hệ thống Homestay, Nhà hàng và các hoạt động giải trí độc đáo được tinh tuyển bởi Celestia.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm homestay, nhà hàng, địa điểm..."
              className="block w-full pl-11 pr-4 py-3 bg-gray-50 border-transparent rounded-xl focus:border-primary focus:bg-white focus:ring-0 sm:text-sm transition-colors"
              value={searchTerm}
              onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
            />
          </div>
          <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <Filter className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
            {['All', 'Homestay', 'Nhà hàng', 'Hoạt động'].map(type => (
              <button
                key={type}
                onClick={() => {setFilterType(type); setCurrentPage(1);}}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filterType === type 
                    ? 'bg-primary text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type === 'All' ? 'Tất cả' : type}
              </button>
            ))}
          </div>
        </div>

        {/* Grid List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700">Không tìm thấy Dịch vụ nào</h3>
            <p className="text-gray-500 mt-2">Vui lòng thử nghiệm bộ lọc hoặc từ khóa khác.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentServices.map(service => (
                <div 
                  key={service.id}
                  onClick={() => navigate(`/service/${service.id}`)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer flex flex-col h-full group"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={service.imageUrl || 'https://images.unsplash.com/photo-1542314831-c6a4d14b8fc4?q=80&w=800&auto=format&fit=crop'} 
                      alt={service.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-gray-900 shadow-sm">
                        {service.type}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center text-gray-500 text-xs mb-2">
                      <MapPin className="w-3 h-3 mr-1" />
                      {service.destination?.name || 'Việt Nam'}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-1">{service.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">{service.description || service.address}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                      <div className="text-lg font-bold text-secondary">
                        {service.price ? `${service.price.toLocaleString('vi-VN')} đ` : 'Thỏa thuận'}
                      </div>
                      <span className="text-sm font-medium text-primary flex items-center">
                        Khám phá <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 space-x-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                      currentPage === index + 1
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ServicesListPage;
