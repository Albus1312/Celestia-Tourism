import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { CreditCard, MapPin, Calendar, Users, Info, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { showToast, confirmAction } from '../../utils/alertUtils';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const bookingData = location.state?.bookingData;
  const itemType = location.state?.itemType; // 'Tour' or 'Service'
  const itemData = location.state?.itemData;
  
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!bookingData || !itemData) {
      navigate(-1);
    }
  }, [bookingData, itemData, navigate]);

  if (!bookingData || !itemData) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.phone) {
      showToast("Vui lòng nhập số điện thoại liên hệ!", "error");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const payload = {
        ...bookingData,
        notes: formData.notes
      };
      
      const response = await axiosClient.post('/booking/book', payload);
      
      const bookingId = response.bookingId || response.id; 
      
      if (bookingId) {
        navigate(`/payment/${bookingId}`);
      } else {
        showToast("Đặt chỗ thành công! Đang chuyển hướng...", "success");
        navigate('/itinerary');
      }
    } catch (error) {
      console.error('Lỗi khi thanh toán:', error);
      showToast('Có lỗi xảy ra trong quá trình xử lý, vui lòng thử lại.', "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-4 max-w-6xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Thanh toán An toàn</h1>
          <p className="text-gray-500 mt-2">Vui lòng kiểm tra lại thông tin trước khi tiến hành thanh toán.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Form */}
          <div className="lg:w-2/3 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Info className="w-5 h-5 mr-2 text-primary" />
                Thông tin người đặt
              </h2>
              
              <form id="checkoutForm" onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Họ và Tên</label>
                    <input 
                      type="text" 
                      required
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email (Nhận vé điện tử)</label>
                    <input 
                      type="email" 
                      disabled
                      value={formData.email}
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 text-sm cursor-not-allowed"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại liên hệ *</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="VD: 0987654321"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm shadow-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Yêu cầu đặc biệt (Không bắt buộc)</label>
                    <textarea 
                      rows="3"
                      placeholder="VD: Đón sân bay, dị ứng thức ăn, yêu cầu phòng..."
                      value={formData.notes}
                      onChange={e => setFormData({...formData, notes: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm shadow-sm"
                    ></textarea>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex items-start">
              <ShieldCheck className="w-8 h-8 text-green-600 mr-4 flex-shrink-0" />
              <div>
                <h4 className="text-green-900 font-bold mb-1">Cam kết bảo mật</h4>
                <p className="text-sm text-green-700">Thông tin của bạn được mã hóa an toàn. Celestia không chia sẻ dữ liệu cá nhân cho bất kỳ bên thứ 3 nào.</p>
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-28">
              <div className="h-40 relative">
                <img 
                  src={itemData.imageUrl || itemData.destination?.coverImageUrl || 'https://images.unsplash.com/photo-1542314831-c6a4d14b8fc4?q=80&w=800&auto=format&fit=crop'} 
                  alt={itemData.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-lg line-clamp-1 text-shadow-sm">{itemData.name}</h3>
                  <div className="flex items-center text-gray-200 text-sm mt-1">
                    <MapPin className="w-3 h-3 mr-1" /> {itemData.destination?.name || 'Việt Nam'}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 flex items-center"><Calendar className="w-4 h-4 mr-2" /> Ngày đi</span>
                    <span className="font-bold text-gray-900">{new Date(bookingData.travelDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 flex items-center"><Users className="w-4 h-4 mr-2" /> Khách</span>
                    <span className="font-bold text-gray-900">{bookingData.numberOfPeople} Người</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-gray-100 pt-4">
                    <span className="text-gray-500">Đơn giá</span>
                    <span className="font-bold text-gray-900">{(bookingData.totalAmount / bookingData.numberOfPeople).toLocaleString('vi-VN')} đ</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-700">TỔNG CỘNG</span>
                    <span className="text-2xl font-black text-secondary">
                      {bookingData.totalAmount.toLocaleString('vi-VN')} <span className="text-sm">VND</span>
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  form="checkoutForm"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center py-4 px-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-teal-700 transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  {isSubmitting ? 'Đang xử lý...' : 'Thanh Toán Ngay'}
                </button>
                <p className="text-center text-xs text-gray-400 mt-4">
                  Bằng việc bấm Thanh Toán Ngay, bạn đồng ý với Điều khoản dịch vụ của Celestia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
