import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { Trash2, AlertTriangle, Image as ImageIcon, Users, EyeOff, Loader2 } from 'lucide-react';
import { showToast, confirmAction } from '../../utils/alertUtils';

const SocialAdminPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await axiosClient.get('/social/admin/posts');
      setPosts(data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách bài viết:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDelete = async (postId, currentStatus) => {
    if (!(await confirmAction(`Bạn có chắc muốn ${currentStatus ? 'khôi phục' : 'khóa'} bài viết này?`))) return;

    try {
      if (!currentStatus) {
        // Delete
        await axiosClient.delete(`/social/post/${postId}`);
      } else {
        // Restore: Since our API only has DeletePost (Soft delete), 
        // to support restore we would need a Restore endpoint.
        // For now, if we don't have it, we just alert.
        showToast('Chức năng khôi phục bài viết đang được xây dựng.', "success");
        return;
      }
      
      // Update local state temporarily
      setPosts(posts.map(p => p.id === postId ? { ...p, isDeleted: !currentStatus } : p));
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      showToast('Có lỗi xảy ra.', "error");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản Lý Mạng Xã Hội</h1>
          <p className="text-sm text-gray-500 mt-1">Kiểm duyệt các bài đăng và hình ảnh của người dùng.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase font-semibold border-b border-gray-200">
              <tr>
                {/* <th className="px-6 py-4">ID</th> */}
                <th className="px-6 py-4">Người đăng</th>
                <th className="px-6 py-4 w-1/3">Nội dung / Hình ảnh</th>
                <th className="px-6 py-4 text-center">Tương tác</th>
                <th className="px-6 py-4 text-center">Đồng hành</th>
                <th className="px-6 py-4">Ngày đăng</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                  {/* <td className="px-6 py-4 font-medium">#{post.id}</td> */}
                  <td className="px-6 py-4 font-medium text-gray-900">{post.userName}</td>
                  <td className="px-6 py-4">
                    <div className="line-clamp-2 mb-2 text-gray-800">{post.content}</div>
                    {post.mediaUrl && (
                      <div className="mt-2">
                        {post.mediaUrl.match(/\.(mp4|mov)$/i) ? (
                          <video src={post.mediaUrl} className="w-32 h-32 object-cover rounded-lg border border-gray-200" controls />
                        ) : (
                          <a href={post.mediaUrl} target="_blank" rel="noreferrer">
                            <img src={post.mediaUrl} alt="Đính kèm" className="w-32 h-32 object-cover rounded-lg border border-gray-200 hover:opacity-80 transition-opacity" />
                          </a>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="text-xs text-gray-500">
                      <span className="font-semibold text-gray-900">{post.likesCount}</span> Like<br/>
                      <span className="font-semibold text-gray-900">{post.commentsCount}</span> Cmt
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {post.isLookingForCompanion ? (
                      <span className="inline-flex items-center bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-1 rounded-lg">
                        <Users className="w-3 h-3 mr-1" /> CÓ
                      </span>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                    {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {post.isDeleted ? (
                      <span className="inline-flex items-center text-red-600 bg-red-50 px-2.5 py-1 rounded-full text-xs font-semibold border border-red-100">
                        <EyeOff className="w-3 h-3 mr-1" /> Đã Khóa
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-green-600 bg-green-50 px-2.5 py-1 rounded-full text-xs font-semibold border border-green-100">
                        Hiển thị
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {!post.isDeleted && (
                      <button 
                        onClick={() => handleToggleDelete(post.id, post.isDeleted)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors inline-flex items-center tooltip-trigger"
                        title="Khóa bài viết này"
                      >
                        <AlertTriangle className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              
              {posts.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                    Chưa có bài viết nào trên hệ thống.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SocialAdminPage;
