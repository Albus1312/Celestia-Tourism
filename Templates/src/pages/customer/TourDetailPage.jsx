import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Users, DollarSign, Info, CheckCircle2, MapPin } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ReviewSection from '../../components/ReviewSection';
import ImageGallerySection from '../../components/ImageGallerySection';
import { showToast, confirmAction } from '../../utils/alertUtils';

const TourDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingDate, setBookingDate] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchTourDetail();
  }, [id]);

  const fetchTourDetail = async () => {
    try {
      setLoading(true);
      const data = await axiosClient.get(`/TourPackages/${id}`);
      setTour(data);

      // Log page view
      try {
        await axiosClient.post('/analytics/log-view', {
          tourPackageId: parseInt(id)
        });
      } catch (err) {
        console.error('Lỗi khi log view:', err);
      }
    } catch (error) {
      console.error('Lỗi khi tải chi tiết Tour:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast("Vui lòng đăng nhập để đặt tour!", "error");
      navigate('/login');
      return;
    }

    if (!tour || !bookingDate) return;
    const totalPrice = tour.price * quantity;

    navigate('/checkout', {
      state: {
        itemType: 'Tour',
        itemData: tour,
        bookingData: {
          tourPackageId: tour.id,
          travelDate: new Date(bookingDate).toISOString(),
          totalAmount: totalPrice,
          numberOfPeople: quantity
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center text-xl text-gray-500">
          Không tìm thấy thông tin Tour.
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6 mt-16">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center w-full transform transition-all">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Đặt Thành Công!</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Yêu cầu đặt tour <strong>{tour.name}</strong> của bạn đã được ghi nhận. Chúng tôi sẽ sớm liên hệ xác nhận.
            </p>
            <button 
              onClick={() => navigate('/tours')}
              className="w-full px-6 py-4 bg-primary text-white font-bold text-lg rounded-xl hover:bg-teal-700 transition-colors shadow-md"
            >
              Trở về Danh sách
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <div className="relative h-96 w-full">
          <img 
            src={tour.imageUrl || (tour.destination ? tour.destination.coverImageUrl : 'https://images.unsplash.com/photo-1542326237-94b1c5a538d4?q=80&w=1200&auto=format&fit=crop')} 
            alt={tour.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute bottom-0 w-full p-8 text-white max-w-7xl mx-auto">
            <span className="inline-block px-4 py-1.5 bg-primary rounded-full text-sm font-bold shadow-lg mb-4">
              Tour Du Lịch
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-shadow-sm">{tour.name}</h1>
            <div className="flex items-center text-gray-200 text-lg font-medium space-x-4">
              {tour.destination && (
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  {tour.destination.name}
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                {tour.durationDays} Ngày {Math.max(1, tour.durationDays - 1)} Đêm
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8">
          
          {/* Left Column - Details */}
          <div className="lg:w-2/3 space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Info className="w-6 h-6 mr-2 text-primary" />
                Thông tin hành trình
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                {tour.description || 'Chưa có mô tả chi tiết cho tour này.'}
              </p>
            </div>

            {/* Gallery Section */}
            {tour.galleryUrls && tour.galleryUrls.length > 0 && (
              <ImageGallerySection urls={tour.galleryUrls} title="Ảnh nổi bật của Tour" />
            )}
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:w-1/3">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 sticky top-28">
              <div className="mb-6 pb-6 border-b border-gray-100">
                <p className="text-gray-500 text-sm font-medium mb-1">Mức giá</p>
                <div className="text-3xl font-bold text-secondary flex items-end">
                  {tour.price ? `${tour.price.toLocaleString('vi-VN')} đ` : 'Liên hệ'}
                  <span className="text-base text-gray-400 ml-1 font-normal">/khách</span>
                </div>
              </div>

              <form onSubmit={handleBook} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Ngày khởi hành dự kiến</label>
                  <input 
                    type="date" 
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Số lượng khách</label>
                  <div className="relative flex items-center">
                    <button 
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 flex items-center justify-center bg-gray-100 text-gray-600 rounded-l-xl hover:bg-gray-200 text-xl font-bold transition-colors"
                    >-</button>
                    <input 
                      type="number" 
                      min="1" max="50"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full h-12 text-center border-y border-gray-200 focus:outline-none font-bold text-lg"
                    />
                    <button 
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 flex items-center justify-center bg-gray-100 text-gray-600 rounded-r-xl hover:bg-gray-200 text-xl font-bold transition-colors"
                    >+</button>
                  </div>
                </div>

                <div className="pt-6">
                  <div className="flex justify-between items-center mb-6 text-lg">
                    <span className="font-medium text-gray-600">Tổng thanh toán:</span>
                    <span className="font-extrabold text-gray-900">
                      {tour.price ? (tour.price * quantity).toLocaleString('vi-VN') + ' đ' : 'Chờ báo giá'}
                    </span>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center px-4 py-4 rounded-xl font-bold text-lg transition-colors shadow-md bg-primary text-white hover:bg-teal-700"
                  >
                    {isSubmitting ? 'Đang xử lý...' : 'Xác Nhận Đặt Tour'}
                  </button>
                  
                  {!user && (
                    <p className="text-sm text-red-500 text-center mt-4">
                      Vui lòng đăng nhập để thực hiện giao dịch
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>

        </div>

        {/* Phần Đánh giá (Review) nằm ngay bên dưới */}
        <div className="bg-white py-12 border-t border-gray-200 mt-12">
          <ReviewSection targetType="tour" targetId={id} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TourDetailPage;
