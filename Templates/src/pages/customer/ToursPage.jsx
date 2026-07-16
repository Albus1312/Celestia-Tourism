import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { Calendar, MapPin, Search, Filter } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const ToursPage = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const toursPerPage = 6;

  const navigate = useNavigate();

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const data = await axiosClient.get('/booking/tours');
      setTours(data.filter(t => !t.isDeleted));
    } catch (error) {
      console.error('Lỗi khi tải Tour:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTours = tours.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (t.destination?.name && t.destination.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastTour = currentPage * toursPerPage;
  const indexOfFirstTour = indexOfLastTour - toursPerPage;
  const currentTours = filteredTours.slice(indexOfFirstTour, indexOfLastTour);
  const totalPages = Math.ceil(filteredTours.length / toursPerPage);

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
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Danh Sách Tour Độc Quyền</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Lựa chọn những hành trình tuyệt vời nhất do Celestia cung cấp.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-10 flex flex-col md:flex-row gap-4 items-center justify-center">
          <div className="relative w-full max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm tour theo tên, địa điểm..."
              className="block w-full pl-11 pr-4 py-3 bg-gray-50 border-transparent rounded-xl focus:border-primary focus:bg-white focus:ring-0 sm:text-sm transition-colors"
              value={searchTerm}
              onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
            />
          </div>
        </div>

        {/* Grid List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredTours.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700">Không tìm thấy Tour nào</h3>
            <p className="text-gray-500 mt-2">Vui lòng thử nghiệm từ khóa khác.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentTours.map(tour => (
                <div 
                  key={tour.id}
                  onClick={() => navigate(`/tours/${tour.id}`)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer flex flex-col h-full group"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={tour.imageUrl || (tour.destination ? tour.destination.coverImageUrl : 'https://images.unsplash.com/photo-1542326237-94b1c5a538d4?q=80&w=1000&auto=format&fit=crop')} 
                      alt={tour.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-gray-900 shadow-sm">
                        Tour
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center text-gray-500 text-xs mb-2">
                      <MapPin className="w-3 h-3 mr-1" />
                      {tour.destination?.name || 'Việt Nam'}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-1">{tour.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">{tour.description}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 flex items-center mb-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          {tour.durationDays} Ngày {Math.max(1, tour.durationDays - 1)} Đêm
                        </span>
                        <div className="text-lg font-bold text-secondary">
                          {tour.price.toLocaleString('vi-VN')} đ
                        </div>
                      </div>
                      <span className="text-sm font-medium text-primary flex items-center">
                        Chi tiết <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
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

export default ToursPage;
