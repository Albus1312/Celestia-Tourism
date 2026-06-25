import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, MapPin, Loader2 } from 'lucide-react';
import { api, API_BASE_URL } from '../../services/api';

const DestinationManager = () => {
  const [destinations, setDestinations] = useState([]);
  const [meta, setMeta] = useState({ categories: [], provinces: [], regions: [] });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(null);
  const [formData, setFormData] = useState({
    id: null, name: '', slug: '', description: '', detailedDescription: '',
    location: '', latitude: 0, longitude: 0, provinceId: '', categoryId: '',
    thumbnailUrl: '', coverUrl: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [dests, metaData] = await Promise.all([
        api.destinations.list(),
        api.destinations.getMetadata()
      ]);
      setDestinations(dests);
      setMeta(metaData);
    } catch (err) {
      alert('Lỗi tải dữ liệu: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploadingImage(field);
      const res = await api.upload.image(file);
      const absoluteUrl = API_BASE_URL.replace('/api', '') + res.url;
      setFormData(prev => ({ ...prev, [field]: absoluteUrl }));
    } catch (err) {
      alert('Lỗi upload ảnh: ' + err.message);
    } finally {
      setUploadingImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = { ...formData };
      delete payload.id;
      
      if (formData.id) {
        await api.destinations.update(formData.id, payload);
        alert('Cập nhật thành công!');
      } else {
        await api.destinations.create(payload);
        alert('Tạo mới thành công!');
      }
      setIsEditing(false);
      loadData();
    } catch (err) {
      alert('Lỗi lưu dữ liệu: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Bạn có chắc muốn xóa địa điểm "${name}"?`)) return;
    try {
      setLoading(true);
      await api.destinations.delete(id);
      alert('Đã xóa thành công!');
      loadData();
    } catch (err) {
      alert('Lỗi xóa: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const editItem = async (item) => {
    try {
      setLoading(true);
      // Fetch full details
      const fullDest = await api.destinations.get(item.id);
      setFormData({
        id: fullDest.id,
        name: fullDest.name,
        slug: fullDest.slug,
        description: fullDest.description || '',
        detailedDescription: fullDest.detailedDescription || '',
        location: fullDest.location || '',
        latitude: fullDest.latitude || 0,
        longitude: fullDest.longitude || 0,
        provinceId: fullDest.provinceId || '',
        categoryId: fullDest.categorySlug ? meta.categories.find(c => c.slug === fullDest.categorySlug)?.id : '',
        thumbnailUrl: fullDest.thumbnailUrl || '',
        coverUrl: fullDest.coverUrl || ''
      });
      setIsEditing(true);
    } catch (err) {
      alert('Không lấy được chi tiết: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !isEditing) return <div style={{ padding: '40px', textAlign: 'center' }}><Loader2 className="animate-spin" style={{ margin: 'auto' }} /></div>;

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>Dữ Liệu Địa Điểm (Master Data)</h2>
          <p style={{ color: '#94a3b8' }}>Quản lý danh sách các điểm đến trên hệ thống.</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => {
              setFormData({
                id: null, name: '', slug: '', description: '', detailedDescription: '',
                location: '', latitude: 0, longitude: 0, provinceId: meta.provinces[0]?.id || '', categoryId: meta.categories[0]?.id || '',
                thumbnailUrl: '', coverUrl: ''
              });
              setIsEditing(true);
            }}
            className="action-button primary"
            style={{ height: 'fit-content' }}
          >
            <Plus size={16} /> Thêm Địa Điểm Mới
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label>Tên Địa Điểm (*)</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="VD: Vịnh Hạ Long" className="builder-input" />
              </div>
              <div className="form-group">
                <label>Đường dẫn tĩnh (Slug) (*)</label>
                <input required type="text" name="slug" value={formData.slug} onChange={handleInputChange} placeholder="VD: vinh-ha-long" className="builder-input" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label>Tỉnh/Thành (*)</label>
                <select required name="provinceId" value={formData.provinceId} onChange={handleInputChange} className="builder-input">
                  <option value="">-- Chọn Tỉnh --</option>
                  {meta.provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Danh mục (*)</label>
                <select required name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="builder-input">
                  <option value="">-- Chọn Danh mục --</option>
                  {meta.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Mô tả ngắn gọn (*)</label>
              <textarea required name="description" value={formData.description} onChange={handleInputChange} className="builder-input" rows="2" />
            </div>

            <div className="form-group">
              <label>Vị trí địa lý (Text)</label>
              <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="VD: Vịnh Bắc Bộ, Tỉnh Quảng Ninh" className="builder-input" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label>Vĩ độ (Latitude)</label>
                <input type="number" step="any" name="latitude" value={formData.latitude} onChange={handleInputChange} className="builder-input" />
              </div>
              <div className="form-group">
                <label>Kinh độ (Longitude)</label>
                <input type="number" step="any" name="longitude" value={formData.longitude} onChange={handleInputChange} className="builder-input" />
              </div>
            </div>

            {/* UPLOAD SECTIONS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label>Ảnh Thumbnail (Card)</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input type="text" name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleInputChange} className="builder-input" style={{ flex: 1 }} />
                  <label style={{ cursor: 'pointer', background: 'var(--accent)', color: 'white', padding: '8px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {uploadingImage === 'thumbnailUrl' ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
                    Tải lên
                    <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(e, 'thumbnailUrl')} />
                  </label>
                </div>
                {formData.thumbnailUrl && <img src={formData.thumbnailUrl} alt="Thumb" style={{ height: '60px', marginTop: '10px', borderRadius: '8px', objectFit: 'cover' }} />}
              </div>
              <div className="form-group">
                <label>Ảnh Bìa (Cover)</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input type="text" name="coverUrl" value={formData.coverUrl} onChange={handleInputChange} className="builder-input" style={{ flex: 1 }} />
                  <label style={{ cursor: 'pointer', background: 'var(--accent)', color: 'white', padding: '8px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {uploadingImage === 'coverUrl' ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
                    Tải lên
                    <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(e, 'coverUrl')} />
                  </label>
                </div>
                {formData.coverUrl && <img src={formData.coverUrl} alt="Cover" style={{ height: '60px', marginTop: '10px', borderRadius: '8px', objectFit: 'cover' }} />}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button type="submit" disabled={loading} className="action-button primary" style={{ flex: 1 }}>
                {loading ? <Loader2 size={18} className="animate-spin" /> : (formData.id ? 'Cập Nhật' : 'Tạo Mới')}
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="action-button secondary" style={{ flex: 1 }}>
                Hủy Bỏ
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {destinations.map(dest => (
            <div key={dest.id} className="glass-panel" style={{ padding: '16px', borderRadius: '16px', position: 'relative' }}>
              <img src={dest.thumbnailUrl || 'https://via.placeholder.com/300x150'} alt={dest.name} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '12px', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>{dest.name}</h3>
              <p style={{ color: '#94a3b8', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '16px' }}>
                <MapPin size={12} /> {dest.provinceName}
              </p>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => editItem(dest)} className="action-button secondary" style={{ flex: 1, padding: '8px' }}>
                  <Edit2 size={14} /> Sửa
                </button>
                <button onClick={() => handleDelete(dest.id, dest.name)} className="action-button secondary" style={{ padding: '8px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DestinationManager;
