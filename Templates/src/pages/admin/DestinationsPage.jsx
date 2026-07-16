import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { Plus, Edit, Trash2, MapPin, Search, LayoutTemplate, Star, X, Image as ImageIcon } from 'lucide-react';
import ManageGalleryModal from '../../components/ManageGalleryModal';
import { useNavigate } from 'react-router-dom';
import { showToast, confirmAction } from '../../utils/alertUtils';

const DestinationsPage = () => {
  const [destinations, setDestinations] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', slug: '', provinceId: '', categoryId: '', coverImageUrl: '' });
  const [formError, setFormError] = useState('');
  
  // Gallery Modal state
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [selectedItemForGallery, setSelectedItemForGallery] = useState(null);
  
  // Featured Modal state
  const [isFeaturedModalOpen, setIsFeaturedModalOpen] = useState(false);
  const [featuredData, setFeaturedData] = useState({ destinationId: null, destinationName: '', tours: [], services: [] });
  const [selectedTourIds, setSelectedTourIds] = useState([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDestinations();
    fetchProvinces();
    fetchCategories();
  }, []);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const data = await axiosClient.get('/destinations');
      setDestinations(data);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu địa điểm:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProvinces = async () => {
    try {
      const data = await axiosClient.get('/geography/provinces');
      setProvinces(data);
    } catch (error) {
      console.error('Lỗi tải danh sách tỉnh thành:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await axiosClient.get('/destinations/categories');
      setCategories(data);
    } catch (error) {
      console.error('Lỗi tải danh mục địa điểm:', error);
    }
  };

  const handleDelete = async (id) => {
    if ((await confirmAction('Bạn có chắc chắn muốn xóa địa điểm này?'))) {
      try {
        await axiosClient.delete(`/destinations/${id}`);
        setDestinations(destinations.filter(d => d.id !== id));
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

  const handleOpenModal = (dest = null) => {
    try {
      setFormError('');
      if (dest) {
        setIsEditing(true);
        setFormData({
          id: dest.id,
          name: dest.name || '',
          slug: dest.slug || '',
          provinceId: dest.provinceId || '',
          categoryId: dest.categoryId || '',
          coverImageUrl: dest.coverImageUrl || '',
          isActive: dest.isActive !== undefined ? dest.isActive : true
        });
      } else {
        setIsEditing(false);
        setFormData({ 
          id: null, 
          name: '', 
          slug: '', 
          provinceId: (provinces && provinces.length > 0) ? provinces[0].id : '', 
          categoryId: (categories && categories.length > 0) ? categories[0].id : '', 
          coverImageUrl: '', 
          description: '',
          address: '',
          videoUrl: '',
          isActive: true 
        });
      }
      setIsModalOpen(true);
    } catch (err) {
      showToast("Lỗi khi mở form: " + err.message, "error");
      console.error(err);
    }
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
      setFormData({ ...formData, coverImageUrl: response.url });
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

    // Generate slug from name if empty
    const slugToUse = formData.slug.trim() === '' 
      ? formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
      : formData.slug;

    const payload = {
      ...formData,
      slug: slugToUse,
      provinceId: parseInt(formData.provinceId),
      categoryId: parseInt(formData.categoryId)
    };
    
    if (!isEditing) {
      delete payload.id;
    }

    try {
      if (isEditing) {
        await axiosClient.put(`/destinations/${formData.id}`, payload);
      } else {
        await axiosClient.post('/destinations', payload);
      }
      handleCloseModal();
      fetchDestinations();
    } catch (error) {
      console.error('Lỗi lưu địa điểm:', error);
      setFormError(error.response?.data?.message || 'Có lỗi xảy ra khi lưu địa điểm.');
    }
  };

  const handleOpenFeaturedModal = async (dest) => {
    try {
      setFeaturedLoading(true);
      setIsFeaturedModalOpen(true);
      setFeaturedData({ ...featuredData, destinationId: dest.id, destinationName: dest.name });
      
      const data = await axiosClient.get(`/destinations/${dest.id}/all-items`);
      setFeaturedData({ 
        destinationId: dest.id, 
        destinationName: dest.name,
        tours: data.tours || [], 
        services: data.services || [] 
      });
      
      setSelectedTourIds(data.tours?.filter(t => t.isFeatured).map(t => t.id) || []);
      setSelectedServiceIds(data.services?.filter(s => s.isFeatured).map(s => s.id) || []);
    } catch (error) {
      console.error('Lỗi tải danh sách items:', error);
      showToast('Không thể tải danh sách Tour & Dịch vụ của địa điểm này.', "error");
      setIsFeaturedModalOpen(false);
    } finally {
      setFeaturedLoading(false);
    }
  };

  const handleSaveFeatured = async () => {
    try {
      setFeaturedLoading(true);
      await axiosClient.post(`/destinations/${featuredData.destinationId}/manage-featured`, {
        tourIds: selectedTourIds,
        serviceIds: selectedServiceIds
      });
      setIsFeaturedModalOpen(false);
      showToast('Cập nhật danh sách nổi bật thành công!', "success");
    } catch (error) {
      console.error('Lỗi cập nhật nổi bật:', error);
      showToast('Có lỗi xảy ra khi lưu danh sách nổi bật.', "error");
    } finally {
      setFeaturedLoading(false);
    }
  };

  const filteredDestinations = destinations.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (d.province?.name && d.province.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <MapPin className="w-7 h-7 text-primary mr-2" />
            Quản lý Địa điểm
          </h1>
          <p className="text-sm text-gray-500 mt-1">Danh sách tất cả các điểm đến du lịch trong hệ thống.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Thêm Địa điểm
        </button>
      </div>

      {/* Filter and Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50/50">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary sm:text-sm transition-shadow"
              placeholder="Tìm kiếm địa điểm hoặc tỉnh thành..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tên Địa điểm</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vị trí</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Danh mục</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">Đang tải dữ liệu...</td></tr>
              ) : filteredDestinations.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">Không tìm thấy địa điểm nào.</td></tr>
              ) : (
                filteredDestinations.map((dest) => (
                  <tr key={dest.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                          {dest.coverImageUrl ? (
                            <img className="h-10 w-10 object-cover" src={dest.coverImageUrl} alt={dest.name} />
                          ) : (
                            <MapPin className="h-5 w-5 text-gray-400 m-2.5" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{dest.name}</div>
                          <div className="text-sm text-gray-500">{dest.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {dest.province?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {dest.category?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {dest.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Hiển thị
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Ẩn
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => navigate(`/admin/builder/destination/${dest.id}`)}
                        className="text-purple-600 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 p-2 rounded-lg transition-colors mr-2"
                        title="Thiết kế Trang Đích"
                      >
                        <LayoutTemplate className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleOpenFeaturedModal(dest)}
                        className="text-yellow-600 hover:text-yellow-900 bg-yellow-50 hover:bg-yellow-100 p-2 rounded-lg transition-colors mr-2"
                        title="Quản lý Nổi bật"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleOpenModal(dest)}
                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-lg transition-colors mr-2"
                        title="Sửa thông tin"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedItemForGallery(dest);
                          setIsGalleryModalOpen(true);
                        }}
                        className="text-teal-600 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 p-2 rounded-lg transition-colors mr-2"
                        title="Quản lý Ảnh nổi bật"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(dest.id)}
                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors"
                        title="Xóa địa điểm"
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
            <div className="relative z-10 inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-xl leading-6 font-bold text-gray-900 mb-4">
                  {isEditing ? 'Cập nhật Địa điểm' : 'Thêm Địa điểm mới'}
                </h3>
                {formError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                    {formError}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tên Địa điểm</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Đường dẫn tĩnh (Slug) - Tùy chọn</label>
                    <input 
                      type="text" 
                      value={formData.slug}
                      onChange={e => setFormData({...formData, slug: e.target.value})}
                      placeholder="Để trống sẽ tự động tạo từ Tên"
                      className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh Cover (Tải lên hoặc URL)</label>
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
                        value={formData.coverImageUrl}
                        onChange={e => setFormData({...formData, coverImageUrl: e.target.value})}
                        placeholder="Hoặc nhập URL hình ảnh (https://...)"
                        className="block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tỉnh/Thành phố</label>
                    <select 
                      required
                      value={formData.provinceId}
                      onChange={e => setFormData({...formData, provinceId: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white"
                    >
                      <option value="" disabled>Chọn tỉnh thành</option>
                      {provinces.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Danh mục</label>
                    <select 
                      required
                      value={formData.categoryId}
                      onChange={e => setFormData({...formData, categoryId: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white"
                    >
                      <option value="" disabled>Chọn danh mục</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Trạng thái hiển thị</label>
                    <select 
                      value={formData.isActive ? "true" : "false"}
                      onChange={e => setFormData({...formData, isActive: e.target.value === "true"})}
                      className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white"
                    >
                      <option value="true">Hiển thị (Công khai)</option>
                      <option value="false">Ẩn (Bản nháp)</option>
                    </select>
                  </div>
                  <div className="pt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      {isEditing ? 'Lưu thay đổi' : 'Thêm địa điểm'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Quản lý Nổi bật */}
      {isFeaturedModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-900 opacity-50" onClick={() => setIsFeaturedModalOpen(false)}></div>
            </div>
            <div className="relative z-10 inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                  <h3 className="text-xl leading-6 font-bold text-gray-900">
                    Quản lý Nổi bật: <span className="text-primary">{featuredData.destinationName}</span>
                  </h3>
                  <button onClick={() => setIsFeaturedModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                {featuredLoading ? (
                  <div className="py-12 text-center text-gray-500">Đang xử lý dữ liệu...</div>
                ) : (
                  <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                    {/* Tours */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-xs mr-2">Tour</span>
                        Danh sách Tour Du lịch
                      </h4>
                      {featuredData.tours.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">Chưa có Tour nào thuộc địa điểm này.</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {featuredData.tours.map(tour => (
                            <label key={tour.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                              <input 
                                type="checkbox" 
                                className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                checked={selectedTourIds.includes(tour.id)}
                                onChange={(e) => {
                                  if (e.target.checked) setSelectedTourIds([...selectedTourIds, tour.id]);
                                  else setSelectedTourIds(selectedTourIds.filter(id => id !== tour.id));
                                }}
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 line-clamp-1">{tour.name}</p>
                                <p className="text-xs text-gray-500">{tour.durationDays} Ngày</p>
                              </div>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Services */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <span className="bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full text-xs mr-2">Dịch vụ</span>
                        Danh sách Dịch vụ Địa phương
                      </h4>
                      {featuredData.services.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">Chưa có Dịch vụ nào thuộc địa điểm này.</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {featuredData.services.map(service => (
                            <label key={service.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                              <input 
                                type="checkbox" 
                                className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                checked={selectedServiceIds.includes(service.id)}
                                onChange={(e) => {
                                  if (e.target.checked) setSelectedServiceIds([...selectedServiceIds, service.id]);
                                  else setSelectedServiceIds(selectedServiceIds.filter(id => id !== service.id));
                                }}
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 line-clamp-1">{service.name}</p>
                                <p className="text-xs text-gray-500">{service.type}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <p className="text-sm text-gray-500 italic">
                    Chỉ nên chọn tối đa 3-4 mục để hiển thị đẹp nhất trên giao diện.
                  </p>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsFeaturedModalOpen(false)}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                      disabled={featuredLoading}
                    >
                      Đóng
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveFeatured}
                      className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-teal-700"
                      disabled={featuredLoading}
                    >
                      Lưu danh sách
                    </button>
                  </div>
                </div>
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
        itemType="destination"
        onSaved={() => {
          setIsGalleryModalOpen(false);
          setSelectedItemForGallery(null);
          fetchDestinations();
        }}
      />
    </div>
  );
};

export default DestinationsPage;
