import React, { useState, useEffect, useRef } from 'react';
import axiosClient from '../api/axiosClient';
import { X, Plus, Image as ImageIcon, Trash2, Upload } from 'lucide-react';
import { showToast, confirmAction } from '../utils/alertUtils';

const ManageGalleryModal = ({ isOpen, onClose, item, itemType, onSaved }) => {
  const [urls, setUrls] = useState([]);
  const [newUrl, setNewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (item && isOpen) {
      setUrls(item.galleryUrls || []);
      setNewUrl('');
    }
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const handleAddUrl = () => {
    if (!newUrl.trim()) return;
    setUrls([...urls, newUrl.trim()]);
    setNewUrl('');
  };

  const handleRemoveUrl = (index) => {
    const newUrls = [...urls];
    newUrls.splice(index, 1);
    setUrls(newUrls);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      // Gọi API tải lên ảnh dành cho admin
      const res = await axiosClient.post('/Uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (res.url) {
        setUrls([...urls, res.url]);
        showToast('Tải ảnh lên thành công!', "success");
      }
    } catch (error) {
      console.error('Lỗi upload ảnh:', error);
      showToast('Tải ảnh lên thất bại!', "error");
    } finally {
      setIsUploading(false);
      // Reset input file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const endpoint = itemType === 'tour' 
        ? `/TourPackages/${item.id}/gallery` 
        : itemType === 'destination'
          ? `/destinations/${item.id}/gallery`
          : `/LocalServices/${item.id}/gallery`;
        
      await axiosClient.put(endpoint, urls);
      showToast('Lưu ảnh nổi bật thành công!', "success");
      onSaved();
    } catch (error) {
      console.error('Lỗi lưu ảnh:', error);
      showToast('Lưu ảnh thất bại!', "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <ImageIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Quản lý Ảnh nổi bật</h2>
              <p className="text-sm text-gray-500">{item.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-grow space-y-6">
          
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700">Thêm ảnh mới</label>
            
            {/* Input URL */}
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Nhập đường dẫn URL hình ảnh..."
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary text-sm"
              />
              <button 
                onClick={handleAddUrl}
                disabled={!newUrl.trim()}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 font-medium flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" /> Thêm URL
              </button>
            </div>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-medium uppercase">hoặc</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Upload File */}
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold text-primary">Bấm để tải ảnh lên</span> từ máy tính
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, WEBP (Tối đa 5MB)</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/png, image/jpeg, image/jpg, image/webp" 
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                  disabled={isUploading}
                />
              </label>
            </div>
            {isUploading && (
              <p className="text-sm text-primary text-center font-medium animate-pulse mt-2">Đang tải ảnh lên...</p>
            )}
          </div>

          {/* Danh sách ảnh hiện tại */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center justify-between">
              <span>Danh sách ảnh đã chọn ({urls.length})</span>
            </h3>
            
            {urls.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-100">
                <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Chưa có ảnh nào được thêm.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {urls.map((url, index) => (
                  <div key={index} className="relative group rounded-xl overflow-hidden shadow-sm border border-gray-200 aspect-[4/3]">
                    <img 
                      src={url} 
                      alt={`Gallery ${index}`} 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Lỗi+hiển+thị+ảnh'; }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={() => handleRemoveUrl(index)}
                        className="p-2 bg-white text-red-500 rounded-full hover:bg-red-50 transition-colors shadow-lg"
                        title="Xóa ảnh này"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            Hủy bỏ
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-teal-700 transition-colors shadow-md disabled:opacity-70 flex items-center"
          >
            {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageGalleryModal;
