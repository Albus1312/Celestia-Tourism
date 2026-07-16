import React, { useState, useEffect } from 'react';
import { Star, AlertTriangle, Send, UserCircle, MessageSquare } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../contexts/AuthContext';
import { showToast, confirmAction } from '../utils/alertUtils';

const ReviewSection = ({ targetType, targetId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [targetId, targetType]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const paramName = targetType === 'destination' ? 'destinationId' : 
                        targetType === 'tour' ? 'tourId' : 'serviceId';
      const data = await axiosClient.get(`/reviews?${paramName}=${targetId}`);
      setReviews(data);
    } catch (error) {
      console.error('Lỗi khi tải đánh giá:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('Vui lòng đăng nhập để gửi đánh giá', "error");
      return;
    }
    if (!comment.trim()) {
      showToast('Vui lòng nhập nội dung đánh giá', "error");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        rating,
        comment,
        destinationId: targetType === 'destination' ? parseInt(targetId) : null,
        tourPackageId: targetType === 'tour' ? parseInt(targetId) : null,
        localServiceId: targetType === 'service' ? parseInt(targetId) : null
      };

      await axiosClient.post('/reviews', payload);
      showToast('Gửi đánh giá thành công!', "success");
      setComment('');
      setRating(5);
      fetchReviews();
    } catch (error) {
      showToast('Có lỗi xảy ra khi gửi đánh giá', "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReport = async (reviewId) => {
    if (!user) {
      showToast('Vui lòng đăng nhập để báo cáo vi phạm', "error");
      return;
    }
    if (!(await confirmAction('Bạn có chắc chắn muốn báo cáo đánh giá này vi phạm tiêu chuẩn cộng đồng?'))) return;
    
    try {
      await axiosClient.post(`/reviews/${reviewId}/report`);
      showToast('Đã gửi báo cáo vi phạm. Cảm ơn bạn!', "success");
      fetchReviews();
    } catch (error) {
      showToast('Lỗi khi gửi báo cáo', "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Star className="w-6 h-6 text-amber-500 mr-2 fill-current" />
            Đánh giá & Phản hồi
            <span className="ml-3 text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {reviews.length} đánh giá
            </span>
          </h2>
        </div>

        {/* Form Đánh giá */}
        <div className="p-8 bg-gray-50/50 border-b border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-sm font-medium text-gray-700 mr-2">Xếp hạng của bạn:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star 
                    className={`w-7 h-7 ${star <= rating ? 'text-amber-400 fill-current' : 'text-gray-300'}`} 
                  />
                </button>
              ))}
            </div>
            
            <div className="relative">
              <textarea
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={user ? "Chia sẻ trải nghiệm của bạn..." : "Vui lòng đăng nhập để đánh giá"}
                disabled={!user || isSubmitting}
                className="w-full rounded-2xl border-gray-200 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-4 pl-4 pr-12 text-sm disabled:bg-gray-50 disabled:cursor-not-allowed resize-none"
              ></textarea>
              <button
                type="submit"
                disabled={!user || isSubmitting || !comment.trim()}
                className="absolute right-3 bottom-3 p-2 bg-primary text-white rounded-xl hover:bg-teal-700 disabled:opacity-50 disabled:hover:bg-primary transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Danh sách Đánh giá */}
        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Đang tải...</div>
          ) : reviews.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p>Chưa có đánh giá nào. Hãy là người đầu tiên chia sẻ cảm nhận!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="p-8 flex space-x-4 hover:bg-gray-50 transition-colors group">
                <div className="flex-shrink-0">
                  <img src={review.userAvatar} alt={review.userName} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-bold text-gray-900">{review.userName}</h4>
                    <span className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div className="flex items-center text-amber-400 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">
                    {review.comment}
                  </p>
                  
                  {/* Action Báo cáo */}
                  <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleReport(review.id)}
                      className="inline-flex items-center text-xs text-gray-400 hover:text-red-500 transition-colors"
                      title="Báo cáo vi phạm tiêu chuẩn cộng đồng"
                    >
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Báo cáo
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
