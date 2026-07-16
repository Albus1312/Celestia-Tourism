import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { Star, MapPin, Clock, DollarSign, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeaturedItemsSection = ({ destinationId }) => {
  const [items, setItems] = useState({ tours: [], services: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (destinationId) {
      fetchFeaturedItems();
    }
  }, [destinationId]);

  const fetchFeaturedItems = async () => {
    try {
      const data = await axiosClient.get(`/destinations/${destinationId}/featured-items`);
      setItems(data);
    } catch (error) {
      console.error('Lỗi tải danh sách nổi bật:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const { tours, services } = items;
  const totalItems = tours.length + services.length;

  if (totalItems === 0) {
    return null; // Không hiển thị nếu không có mục nổi bật nào
  }

  // Kết hợp và giới hạn 3 phần tử như user yêu cầu
  const combinedItems = [
    ...tours.map(t => ({ ...t, itemType: 'tour' })),
    ...services.map(s => ({ ...s, itemType: 'service' }))
  ].slice(0, 3); // Lấy đúng 3 cái

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="bg-gray-50/50 py-16 mt-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-2 block">
            Dành riêng cho bạn
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-display">
            Trải nghiệm & Dịch vụ Nổi bật
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Khám phá những lựa chọn tuyệt vời nhất được chúng tôi tuyển chọn kỹ lưỡng để chuyến đi của bạn thêm phần hoàn hảo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {combinedItems.map((item, idx) => (
            <div 
              key={`${item.itemType}-${item.id}-${idx}`}
              className="bg-white rounded-2xl overflow-hidden shadow-lg shadow-gray-200/50 hover:shadow-xl transition-all duration-300 group flex flex-col h-full border border-gray-100"
            >
              <div className="relative h-60 overflow-hidden">
                <img 
                  src={item.imageUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800'} 
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-primary shadow-sm">
                  {item.itemType === 'tour' ? 'Tour Du Lịch' : (item.type || 'Dịch vụ')}
                </div>
                {item.itemType === 'tour' && (
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white flex items-center shadow-sm">
                    <Clock className="w-3 h-3 mr-1" />
                    {item.durationDays} Ngày
                  </div>
                )}
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {item.name}
                </h3>
                
                {item.itemType === 'service' && (
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                    <span className="line-clamp-1">{item.address || 'Đang cập nhật'}</span>
                  </div>
                )}
                
                <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow">
                  {item.description || 'Chưa có mô tả chi tiết cho trải nghiệm này.'}
                </p>

                <div className="flex items-end justify-between pt-4 border-t border-gray-100 mt-auto">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-medium">Chỉ từ</p>
                    <div className="flex items-center text-primary font-bold text-xl">
                      {formatPrice(item.price)}
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(item.itemType === 'tour' ? `/tours/${item.id}` : `/services/${item.id}`)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedItemsSection;
