import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Calendar, Compass, Building, MapPin, Clock, CheckCircle, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const ItineraryPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All'); // All, Pending, Confirmed

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const data = await axiosClient.get('/booking/my-bookings');
      // Sort by booking date descending
      const sorted = data.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
      setBookings(sorted);
    } catch (error) {
      console.error('Lỗi khi tải lịch trình:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    const result = await Swal.fire({
      title: 'Hủy đơn hàng?',
      text: "Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#9ca3af',
      confirmButtonText: 'Có, hủy đơn ngay',
      cancelButtonText: 'Không, giữ lại'
    });

    if (result.isConfirmed) {
      try {
        await axiosClient.put(`/booking/${id}/cancel`);
        Swal.fire({
          title: 'Đã hủy!',
          text: 'Đơn hàng của bạn đã được hủy thành công.',
          icon: 'success',
          confirmButtonColor: '#0f766e'
        });
        fetchMyBookings();
      } catch (error) {
        Swal.fire({
          title: 'Hủy thất bại!',
          text: error.response?.data?.message || 'Có lỗi xảy ra khi hủy đơn hàng.',
          icon: 'error',
          confirmButtonColor: '#0f766e'
        });
      }
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'All') return true;
    return b.status === activeTab;
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 1:
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200"><CheckCircle className="w-3 h-3 mr-1" /> Đã xác nhận</span>;
      case 0:
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200"><Clock3 className="w-3 h-3 mr-1" /> Đang chờ</span>;
      case 2:
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">Đã hủy</span>;
      case 3:
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">Đã hoàn thành</span>;
      default:
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">Không xác định</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-4 max-w-5xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Thẻ Lịch Trình</h1>
            <p className="text-gray-500 mt-2">Theo dõi và quản lý các chuyến đi của bạn cùng Celestia.</p>
          </div>
          <div className="flex bg-gray-200 p-1 rounded-xl w-fit overflow-x-auto">
            {['All', 0, 1, 3, 2].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 whitespace-nowrap rounded-lg text-sm font-bold transition-all ${
                  activeTab === tab 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'All' ? 'Tất cả' : (tab === 0 ? 'Đang chờ' : (tab === 1 ? 'Đã xác nhận' : (tab === 3 ? 'Hoàn thành' : 'Đã hủy')))}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700">Chưa có lịch trình nào</h3>
            <p className="text-gray-500 mt-2 mb-6">Bạn chưa có đơn đặt Tour hoặc Dịch vụ nào trong mục này.</p>
            <Link to="/tours" className="inline-flex items-center px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-teal-700 transition-colors">
              Khám phá ngay
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => {
              const isTour = !!booking.tourPackage;
              const item = booking.tourPackage || booking.localService;
              
              if (!item) return null;

              return (
                <div key={booking.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-1/4 h-48 sm:h-auto relative bg-gray-200">
                      <img 
                        src={item.imageUrl || item.destination?.coverImageUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop'} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold shadow-sm flex items-center">
                          {isTour ? <Compass className="w-3 h-3 mr-1 text-primary" /> : <Building className="w-3 h-3 mr-1 text-secondary" />}
                          {isTour ? 'Tour Trọn Gói' : 'Dịch Vụ Local'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6 sm:w-3/4 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-gray-900 pr-4">{item.name}</h3>
                          {getStatusBadge(booking.status)}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <MapPin className="w-4 h-4 mr-1" />
                          {item.destination?.name || 'Việt Nam'}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-50">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Mã đơn hàng</p>
                          <p className="font-bold text-gray-900">#{booking.id}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Ngày {isTour ? 'khởi hành' : 'sử dụng'}</p>
                          <p className="font-bold text-gray-900 flex items-center">
                            <Clock className="w-3 h-3 mr-1 text-gray-400" />
                            {new Date(booking.travelDate).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Số lượng</p>
                          <p className="font-bold text-gray-900">{booking.numberOfPeople} Khách</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Tổng tiền</p>
                          <p className="font-bold text-secondary text-lg">{booking.totalAmount.toLocaleString('vi-VN')} đ</p>
                        </div>
                      </div>
                      
                      {booking.status === 0 && (
                        <div className="flex justify-end border-t border-gray-50 pt-4 mt-4">
                           <button 
                             onClick={() => handleCancelBooking(booking.id)}
                             className="px-5 py-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 font-bold rounded-lg text-sm transition-colors border border-red-100"
                           >
                             Hủy đơn hàng
                           </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ItineraryPage;
