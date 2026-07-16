import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { Plus, Edit, Trash2, Compass, Search, Image as ImageIcon } from 'lucide-react';
import ManageGalleryModal from '../../components/ManageGalleryModal';
import { showToast, confirmAction } from '../../utils/alertUtils';

const TourPackagesPage = () => {
  const [tours, setTours] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Gallery Modal state
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [selectedItemForGallery, setSelectedItemForGallery] = useState(null);
  const [formData, setFormData] = useState({ 
    id: null, 
    name: '', 
    description: '', 
    price: 0, 
    durationDays: 1, 
    destinationId: '',
    imageUrl: ''
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchTours();
    fetchDestinations();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const data = await axiosClient.get('/tourpackages');
      setTours(data);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu Tour:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDestinations = async () => {
    try {
      const data = await axiosClient.get('/destinations');
      setDestinations(data);
    } catch (error) {
      console.error('Lỗi tải danh sách địa điểm:', error);
    }
  };

  const handleDelete = async (id) => {
    if ((await confirmAction('Bạn có chắc chắn muốn xóa Gói Tour này?'))) {
      try {
        await axiosClient.delete(`/tourpackages/${id}`);
        setTours(tours.filter(t => t.id !== id));
      } catch (error) {
        console.error('Lỗi khi xóa:', error);
        if (error.response?.status === 403) {
          showToast('Bạn không có quyền thực hiện chức năng này! (Yêu cầu quyền Admin, "error")');
        } else {
          showToast(error.response?.data?.message || 'Có lỗi xảy ra khi xóa!', "error");
        }
      }
    }
  };

  const handleOpenModal = (tour = null) => {
    setFormError('');
    if (tour) {
      setIsEditing(true);
      setFormData({
        id: tour.id,
        name: tour.name || '',
        description: tour.description || '',
        price: tour.price || 0,
        durationDays: tour.durationDays || 1,
        destinationId: tour.destinationId || '',
        imageUrl: tour.imageUrl || ''
      });
    } else {
      setIsEditing(false);
      setFormData({ 
        id: null, 
        name: '', 
        description: '', 
        price: 0, 
        durationDays: 1, 
        destinationId: destinations.length > 0 ? destinations[0].id : '',
        imageUrl: ''
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
      setFormError('');
      const response = await axiosClient.post('/Uploads', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setFormData({ ...formData, imageUrl: response.url });
    } catch (error) {
      console.error('Lỗi upload ảnh:', error);
      setFormError(error.response?.data?.message || 'Có lỗi xảy ra khi tải ảnh lên.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.destinationId) {
      setFormError('Vui lòng chọn một địa điểm cho Tour này.');
      return;
    }

    const payload = { ...formData };
    
    if (!isEditing) {
      delete payload.id;
    }

    try {
      if (isEditing) {
        await axiosClient.put(`/tourpackages/${formData.id}`, payload);
      } else {
        await axiosClient.post('/tourpackages', payload);
      }
      handleCloseModal();
      fetchTours(); // Refresh data
    } catch (error) {
      console.error('Lỗi lưu Tour:', error);
      if (error.response?.status === 403) {
        setFormError('Bạn không có quyền thực hiện chức năng này!');
      } else {
        setFormError(error.response?.data?.message || 'Có lỗi xảy ra khi lưu Tour.');
      }
    }
  };

  const filteredTours = tours.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (t.destination?.name && t.destination.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Compass className="w-7 h-7 text-primary mr-2" />
            Quản lý Gói Tour
          </h1>
          <p className="text-sm text-gray-500 mt-1">Thêm, sửa, xóa các Tour trọn gói cho từng địa điểm.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Thêm Tour mới
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50/50">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary sm:text-sm transition-shadow"
              placeholder="Tìm theo tên Tour hoặc địa điểm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tên Tour</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Địa điểm</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Giá tiền</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Thời lượng</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">Đang tải dữ liệu...</td></tr>
              ) : filteredTours.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">Không tìm thấy Gói Tour nào.</td></tr>
              ) : (
                filteredTours.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden mr-4">
                          {t.imageUrl ? (
                            <img className="h-10 w-10 object-cover" src={t.imageUrl} alt={t.name} />
                          ) : (
                            <Compass className="h-5 w-5 text-gray-400 m-2.5" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">{t.name}</div>
                          <div className="text-xs text-gray-500 line-clamp-1">{t.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {t.destination?.name || 'Chưa phân bổ'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-secondary">
                        {t.price ? t.price.toLocaleString('vi-VN') + ' đ' : 'Miễn phí'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">{t.durationDays} Ngày</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleOpenModal(t)}
                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-lg transition-colors mr-2"
                        title="Sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedItemForGallery(t);
                          setIsGalleryModalOpen(true);
                        }}
                        className="text-teal-600 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 p-2 rounded-lg transition-colors mr-2"
                        title="Quản lý Ảnh nổi bật"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(t.id)}
                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm/Sửa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-900 opacity-50" onClick={handleCloseModal}></div>
            </div>
            <div className="relative z-10 inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-xl leading-6 font-bold text-gray-900 mb-4 flex items-center">
                  <Compass className="w-6 h-6 mr-2 text-primary" />
                  {isEditing ? 'Cập nhật Gói Tour' : 'Thêm Gói Tour mới'}
                </h3>
                {formError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                    {formError}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tên Tour</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      placeholder="VD: Khám phá Tam Đảo 2 Ngày 1 Đêm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh Cover Tour (Tải lên hoặc URL)</label>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={isUploading}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-teal-700 cursor-pointer"
                        />
                        {isUploading && <span className="text-sm text-gray-500 animate-pulse">Đang tải...</span>}
                      </div>
                      <input 
                        type="text" 
                        value={formData.imageUrl}
                        onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                        className="block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        placeholder="Hoặc nhập URL hình ảnh (https://...)"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Giá tiền (VNĐ)</label>
                      <input 
                        type="number" 
                        min="0"
                        required
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Thời lượng (Số ngày)</label>
                      <input 
                        type="number" 
                        min="1"
                        required
                        value={formData.durationDays}
                        onChange={e => setFormData({...formData, durationDays: Number(e.target.value)})}
                        className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Thuộc Địa điểm</label>
                    <select
                      required
                      value={formData.destinationId}
                      onChange={e => setFormData({...formData, destinationId: Number(e.target.value)})}
                      className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    >
                      <option value="" disabled>-- Chọn địa điểm --</option>
                      {destinations.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mô tả tóm tắt</label>
                    <textarea 
                      rows="3"
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      placeholder="Mô tả ngắn gọn về trải nghiệm..."
                    ></textarea>
                  </div>
                  
                  <div className="pt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      {isEditing ? 'Lưu thay đổi' : 'Tạo Tour'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      <ManageGalleryModal 
        isOpen={isGalleryModalOpen}
        onClose={() => {
          setIsGalleryModalOpen(false);
          setSelectedItemForGallery(null);
        }}
        item={selectedItemForGallery}
        itemType="tour"
        onSaved={() => {
          setIsGalleryModalOpen(false);
          setSelectedItemForGallery(null);
          fetchTours();
        }}
      />
    </div>
  );
};

export default TourPackagesPage;
