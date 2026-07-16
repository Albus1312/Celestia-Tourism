import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { Plus, Edit, Trash2, BookOpen, Search, Upload, Loader2, Image as ImageIcon, FileText } from 'lucide-react';
import { showToast, confirmAction } from '../../utils/alertUtils';

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({ 
    id: null, 
    title: '', 
    slug: '', 
    excerpt: '',
    thumbnailUrl: '',
    contentJson: '',
    destinationId: ''
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [articlesData, destData] = await Promise.all([
        axiosClient.get('/articles'),
        axiosClient.get('/destinations')
      ]);
      setArticles(articlesData);
      setDestinations(destData.filter(d => d.isActive));
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu bài viết:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if ((await confirmAction('Bạn có chắc chắn muốn xóa bài viết này?'))) {
      try {
        await axiosClient.delete(`/articles/${id}`);
        setArticles(articles.filter(a => a.id !== id));
      } catch (error) {
        console.error('Lỗi khi xóa:', error);
        showToast('Có lỗi xảy ra khi xóa!', "error");
      }
    }
  };

  const handleOpenModal = (article = null) => {
    setFormError('');
    if (article) {
      setIsEditing(true);
      setFormData({
        id: article.id,
        title: article.title || '',
        slug: article.slug || '',
        excerpt: article.excerpt || '',
        thumbnailUrl: article.thumbnailUrl || '',
        contentJson: article.contentJson || '',
        destinationId: article.destinationId || ''
      });
    } else {
      setIsEditing(false);
      setFormData({ 
        id: null, 
        title: '', 
        slug: '', 
        excerpt: '',
        thumbnailUrl: '',
        contentJson: '',
        destinationId: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      setIsUploading(true);
      const res = await axiosClient.post('/uploads', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({ ...prev, thumbnailUrl: res.url }));
    } catch (error) {
      console.error('Lỗi tải ảnh:', error);
      showToast('Không thể tải ảnh lên. Vui lòng thử lại.', "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const slugToUse = formData.slug.trim() === '' 
      ? formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
      : formData.slug;

    const payload = {
      ...formData,
      slug: slugToUse,
      destinationId: formData.destinationId ? parseInt(formData.destinationId) : null
    };
    
    if (!isEditing) {
      delete payload.id;
    }

    try {
      if (isEditing) {
        await axiosClient.put(`/articles/${formData.id}`, payload);
      } else {
        await axiosClient.post('/articles', payload);
      }
      handleCloseModal();
      fetchData();
    } catch (error) {
      console.error('Lỗi lưu bài viết:', error);
      setFormError(error.response?.data?.message || 'Có lỗi xảy ra khi lưu bài viết.');
    }
  };

  const filteredArticles = articles.filter(a => 
    a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <BookOpen className="w-6 h-6 mr-2 text-primary" />
            Quản lý Bài viết (eMagazine)
          </h1>
          <p className="text-gray-500 text-sm mt-1">Quản lý các bài viết tạp chí, cẩm nang du lịch</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm Bài viết
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="relative max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm bài viết..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                  {/* <th className="p-4 font-semibold w-16">ID</th> */}
                  <th className="p-4 font-semibold w-24">Ảnh bìa</th>
                  <th className="p-4 font-semibold">Tiêu đề</th>
                  <th className="p-4 font-semibold">Tóm tắt</th>
                  <th className="p-4 font-semibold text-center w-24">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredArticles.length > 0 ? (
                  filteredArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50/50 transition-colors">
                      {/* <td className="p-4 text-gray-600">#{article.id}</td> */}
                      <td className="p-4">
                        <div className="w-16 h-12 bg-gray-100 rounded overflow-hidden">
                          {article.thumbnailUrl ? (
                            <img src={article.thumbnailUrl} alt={article.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon className="w-4 h-4"/></div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-gray-900 line-clamp-1">{article.title}</div>
                        <div className="text-xs text-gray-500 mt-1">/{article.slug}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-600 line-clamp-2">{article.excerpt}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center space-x-2">
                          <Link 
                            to={`/admin/articles/${article.id}/content`}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Soạn nội dung"
                          >
                            <FileText className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => handleOpenModal(article)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Sửa thông tin cơ bản"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(article.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500">
                      Không tìm thấy bài viết nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Thêm/Sửa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? 'Sửa bài viết' : 'Thêm bài viết mới'}
              </h2>
              <button 
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {formError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  {formError}
                </div>
              )}
              
              <form id="articleForm" onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Tiêu đề bài viết *</label>
                    <input 
                      type="text" 
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="Nhập tiêu đề..."
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Đường dẫn (Slug)</label>
                    <input 
                      type="text" 
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="Để trống sẽ tự tạo từ tiêu đề"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Ảnh Bìa (Thumbnail)</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={formData.thumbnailUrl}
                        onChange={(e) => setFormData({...formData, thumbnailUrl: e.target.value})}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="URL ảnh hoặc tải lên..."
                      />
                      <label className="flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer transition-colors relative">
                        {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                        <input 
                          type="file" 
                          accept="image/*"
                          className="hidden" 
                          onChange={handleImageUpload}
                          disabled={isUploading}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Liên kết Địa điểm (Tùy chọn)</label>
                    <select
                      value={formData.destinationId}
                      onChange={(e) => setFormData({...formData, destinationId: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                    >
                      <option value="">-- Không gắn với địa điểm nào --</option>
                      {destinations.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Đoạn trích (Excerpt) *</label>
                  <textarea 
                    required
                    value={formData.excerpt}
                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="Mô tả ngắn gọn về bài viết (hiển thị ngoài danh sách)..."
                    rows="4"
                  ></textarea>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
              <button 
                type="button"
                onClick={handleCloseModal}
                className="px-5 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Hủy bỏ
              </button>
              <button 
                form="articleForm"
                type="submit"
                className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-teal-700 transition-colors font-medium shadow-sm"
              >
                {isEditing ? 'Cập nhật Bài viết' : 'Tạo Bài viết'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticlesPage;
