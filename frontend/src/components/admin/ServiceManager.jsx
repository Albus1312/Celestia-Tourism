import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, MapPin, Loader2, Star } from 'lucide-react';
import { api, API_BASE_URL } from '../../services/api';

const ServiceManager = () => {
  const [services, setServices] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingService, setEditingService] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'Homestay',
    description: '',
    address: '',
    phone: '',
    imageUrl: '',
    rating: 5.0,
    destinationId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [svcRes, destRes] = await Promise.all([
        api.services.getAll({ limit: 100 }),
        api.destinations.getAll({ limit: 100 })
      ]);
      setServices(svcRes.data);
      setDestinations(destRes.data);
    } catch (err) {
      console.error(err);
      alert('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const res = await api.upload.image(file);
      const url = API_BASE_URL.replace('/api', '') + res.url;
      setFormData({ ...formData, imageUrl: url });
    } catch (err) {
      alert('Lỗi upload ảnh: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.destinationId) {
      alert('Vui lòng chọn địa điểm');
      return;
    }
    
    try {
      if (editingService) {
        await api.services.update(editingService.id, formData);
      } else {
        await api.services.create(formData);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const openAddModal = () => {
    setEditingService(null);
    setFormData({
      name: '',
      type: 'Homestay',
      description: '',
      address: '',
      phone: '',
      imageUrl: '',
      rating: 5.0,
      destinationId: destinations.length > 0 ? destinations[0].id : ''
    });
    setShowModal(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      type: service.type,
      description: service.description,
      address: service.address,
      phone: service.phone,
      imageUrl: service.imageUrl,
      rating: service.rating,
      destinationId: service.destinationId
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa dịch vụ này?')) return;
    try {
      await api.services.delete(id);
      fetchData();
    } catch (err) {
      alert('Lỗi xóa: ' + err.message);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Đang tải...</div>;

  return (
    <div className="manager-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Quản lý Dịch vụ (Homestay, Nhà hàng...)</h2>
        <button className="action-button primary" onClick={openAddModal}>
          <Plus size={16} /> Thêm Dịch vụ Mới
        </button>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Hình ảnh</th>
              <th>Tên dịch vụ</th>
              <th>Loại</th>
              <th>Thuộc Địa điểm</th>
              <th>Đánh giá</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {services.map(svc => (
              <tr key={svc.id}>
                <td>{svc.id}</td>
                <td>
                  <div style={{ width: '60px', height: '40px', borderRadius: '4px', background: '#eee', overflow: 'hidden' }}>
                    {svc.imageUrl ? (
                      <img src={svc.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                    ) : (
                      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                        <ImageIcon size={16} />
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <strong style={{ display: 'block' }}>{svc.name}</strong>
                  <span style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    <MapPin size={10} /> {svc.address}
                  </span>
                </td>
                <td>
                  <span style={{ 
                    padding: '2px 8px', 
                    borderRadius: '12px', 
                    fontSize: '11px', 
                    fontWeight: '600',
                    background: svc.type === 'Homestay' ? '#fdf4ff' : svc.type === 'Restaurant' ? '#fffbeb' : '#f0fdfa',
                    color: svc.type === 'Homestay' ? '#c026d3' : svc.type === 'Restaurant' ? '#d97706' : '#0d9488'
                  }}>
                    {svc.type}
                  </span>
                </td>
                <td>{destinations.find(d => d.id === svc.destinationId)?.name || 'N/A'}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#eab308', fontWeight: 'bold' }}>
                    <Star size={14} fill="#eab308" /> {svc.rating}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="action-button small" onClick={() => openEditModal(svc)}>
                      <Edit2 size={14} /> Sửa
                    </button>
                    <button className="action-button small danger" onClick={() => handleDelete(svc.id)}>
                      <Trash2 size={14} /> Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  Chưa có dịch vụ nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>
              {editingService ? 'Chỉnh sửa Dịch vụ' : 'Thêm Dịch vụ Mới'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Tên dịch vụ *</label>
                  <input required className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                
                <div className="form-group">
                  <label>Loại hình *</label>
                  <select className="form-input" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option value="Homestay">Homestay / Khách sạn</option>
                    <option value="Restaurant">Nhà hàng / Quán ăn</option>
                    <option value="Transport">Di chuyển / Dịch vụ khác</option>
                  </select>
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Thuộc Địa điểm *</label>
                  <select required className="form-input" value={formData.destinationId} onChange={e => setFormData({...formData, destinationId: Number(e.target.value)})}>
                    <option value="">-- Chọn địa điểm --</option>
                    {destinations.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Hình ảnh (URL hoặc Tải lên)</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input className="form-input" style={{ flex: 1 }} value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
                    <label style={{ cursor: 'pointer', background: 'var(--accent)', color: 'white', padding: '8px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      {uploadingImage ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
                      Tải lên
                      <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                    </label>
                  </div>
                  {formData.imageUrl && (
                    <img src={formData.imageUrl} alt="" style={{ height: '80px', borderRadius: '8px', marginTop: '10px', objectFit: 'cover' }} />
                  )}
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Mô tả</label>
                  <textarea className="form-textarea" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                </div>

                <div className="form-group">
                  <label>Địa chỉ cụ thể</label>
                  <input className="form-input" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>

                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input className="form-input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                
                <div className="form-group">
                  <label>Đánh giá (Rating 0-5)</label>
                  <input type="number" step="0.1" min="0" max="5" className="form-input" value={formData.rating} onChange={e => setFormData({...formData, rating: parseFloat(e.target.value)})} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '30px' }}>
                <button type="button" className="action-button" onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit" className="action-button primary">Lưu Dịch vụ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManager;
