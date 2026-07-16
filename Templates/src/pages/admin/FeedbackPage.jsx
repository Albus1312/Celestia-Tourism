import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, Trash2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { showToast, confirmAction } from '../../utils/alertUtils';

const FeedbackPage = () => {
  const [activeTab, setActiveTab] = useState('reviews'); // 'reviews' or 'comments'
  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'reviews') {
      fetchReviews();
    } else {
      fetchComments();
    }
  }, [activeTab]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await axiosClient.get('/reviews/admin');
      setReviews(data);
    } catch (error) {
      showToast('Lỗi khi tải danh sách Đánh giá', "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await axiosClient.get('/comments/admin');
      setComments(data);
    } catch (error) {
      showToast('Lỗi khi tải danh sách Bình luận', "error");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApproveReview = async (id, currentStatus) => {
    try {
      await axiosClient.put(`/reviews/admin/${id}/toggle-approve`);
      showToast(currentStatus ? 'Đã ẩn đánh giá' : 'Đã duyệt đánh giá', "success");
      fetchReviews();
    } catch (error) {
      showToast('Có lỗi xảy ra', "error");
    }
  };

  const handleDeleteReview = async (id) => {
    if (!(await confirmAction('Bạn có chắc chắn muốn xóa đánh giá này không?'))) return;
    try {
      await axiosClient.delete(`/reviews/admin/${id}`);
      showToast('Đã xóa đánh giá', "success");
      fetchReviews();
    } catch (error) {
      showToast('Lỗi khi xóa đánh giá', "error");
    }
  };

  const handleToggleApproveComment = async (id, currentStatus) => {
    try {
      await axiosClient.put(`/comments/admin/${id}/toggle-approve`);
      showToast(currentStatus ? 'Đã ẩn bình luận' : 'Đã duyệt bình luận', "success");
      fetchComments();
    } catch (error) {
      showToast('Có lỗi xảy ra', "error");
    }
  };

  const handleDeleteComment = async (id) => {
    if (!(await confirmAction('Bạn có chắc chắn muốn xóa bình luận này không?'))) return;
    try {
      await axiosClient.delete(`/comments/admin/${id}`);
      showToast('Đã xóa bình luận', "success");
      fetchComments();
    } catch (error) {
      showToast('Lỗi khi xóa bình luận', "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Đánh giá & Phản hồi</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý và kiểm duyệt nội dung tương tác của người dùng.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-4 px-4 text-sm font-medium transition-colors border-b-2 flex items-center ${
            activeTab === 'reviews'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Star className="w-4 h-4 mr-2" />
          Đánh giá Dịch vụ/Tour (Reviews)
        </button>
        <button
          onClick={() => setActiveTab('comments')}
          className={`pb-4 px-4 text-sm font-medium transition-colors border-b-2 flex items-center ${
            activeTab === 'comments'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Bình luận Bài viết (Comments)
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Đang tải dữ liệu...</div>
        ) : activeTab === 'reviews' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-sm text-gray-500">
                  <th className="pb-3 font-medium px-4">Người dùng</th>
                  <th className="pb-3 font-medium px-4">Mục đánh giá</th>
                  <th className="pb-3 font-medium px-4">Nội dung</th>
                  <th className="pb-3 font-medium px-4 text-center">Báo cáo</th>
                  <th className="pb-3 font-medium px-4 text-center">Trạng thái</th>
                  <th className="pb-3 font-medium px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {reviews.map((r) => (
                  <tr key={r.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${r.reportCount > 0 ? 'bg-red-50/50' : ''}`}>
                    <td className="py-4 px-4 font-medium text-gray-800">{r.userName}</td>
                    <td className="py-4 px-4 text-gray-600">{r.targetName}</td>
                    <td className="py-4 px-4 text-gray-600">
                      <div className="flex items-center text-amber-500 mb-1">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                      <p className="line-clamp-2">{r.comment}</p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {r.reportCount > 0 ? (
                        <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {r.reportCount}
                        </span>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {r.isApproved ? (
                        <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          <CheckCircle className="w-3 h-3 mr-1" /> Đã duyệt
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          <XCircle className="w-3 h-3 mr-1" /> Đã ẩn
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleToggleApproveReview(r.id, r.isApproved)}
                          className={`p-2 rounded-lg transition-colors ${r.isApproved ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                          title={r.isApproved ? "Ẩn bài" : "Duyệt bài"}
                        >
                          {r.isApproved ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteReview(r.id)}
                          className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Xóa vĩnh viễn"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {reviews.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">
                      Không có đánh giá nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-sm text-gray-500">
                  <th className="pb-3 font-medium px-4">Người dùng</th>
                  <th className="pb-3 font-medium px-4">Bài viết (eMagazine)</th>
                  <th className="pb-3 font-medium px-4">Nội dung bình luận</th>
                  <th className="pb-3 font-medium px-4 text-center">Báo cáo</th>
                  <th className="pb-3 font-medium px-4 text-center">Trạng thái</th>
                  <th className="pb-3 font-medium px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {comments.map((c) => (
                  <tr key={c.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${c.reportCount > 0 ? 'bg-red-50/50' : ''}`}>
                    <td className="py-4 px-4 font-medium text-gray-800">{c.userName}</td>
                    <td className="py-4 px-4 text-gray-600 max-w-xs truncate" title={c.articleTitle}>{c.articleTitle}</td>
                    <td className="py-4 px-4 text-gray-600">
                      <p className="line-clamp-2">{c.content}</p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {c.reportCount > 0 ? (
                        <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {c.reportCount}
                        </span>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {c.isApproved ? (
                        <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          <CheckCircle className="w-3 h-3 mr-1" /> Đã duyệt
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          <XCircle className="w-3 h-3 mr-1" /> Đã ẩn
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleToggleApproveComment(c.id, c.isApproved)}
                          className={`p-2 rounded-lg transition-colors ${c.isApproved ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                          title={c.isApproved ? "Ẩn bình luận" : "Duyệt bình luận"}
                        >
                          {c.isApproved ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteComment(c.id)}
                          className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Xóa vĩnh viễn"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {comments.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">
                      Không có bình luận nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;
