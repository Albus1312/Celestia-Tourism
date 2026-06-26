import React, { useState, useEffect } from 'react';
import { api, API_BASE_URL } from '../../services/api';
import { Plus, Trash2, Loader2, Save, Navigation, MapPin } from 'lucide-react';

const TourManager = () => {
  const [tours, setTours] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    durationDays: 1,
    destinationId: ''
  });

  useEffect(() => {
    fetchTours();
    fetchDestinations();
  }, []);

  const fetchTours = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/tours`);
      if (res.ok) {
        const data = await res.json();
        setTours(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDestinations = async () => {
    try {
      const destList = await api.destinations.list();
      setDestinations(destList || []);
      if (destList && destList.length > 0) {
        setFormData(prev => ({ ...prev, destinationId: destList[0].id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        durationDays: Number(formData.durationDays),
        destinationId: Number(formData.destinationId)
      };

      const res = await fetch(`${API_BASE_URL}/tours`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setFormData({ name: '', description: '', price: 0, durationDays: 1, destinationId: destinations[0]?.id || '' });
        setEditingId(null);
        fetchTours();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa tour này?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/tours/${id}`, { method: 'DELETE' });
      if (res.ok) fetchTours();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800' }}>Quản Lý Gói Tour</h2>
        <button 
          onClick={() => setEditingId('new')}
          className="admin-btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', background: 'var(--primary)', color: 'white', fontWeight: 'bold' }}
        >
          <Plus size={18} /> Thêm Gói Tour Mới
        </button>
      </div>

      {editingId === 'new' && (
        <form onSubmit={handleSave} style={{ background: 'white', padding: '24px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Thêm Gói Tour Mới</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Tên Tour</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Địa Danh</label>
              <select 
                required
                value={formData.destinationId}
                onChange={e => setFormData({...formData, destinationId: e.target.value})}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
              >
                {destinations.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Giá vé (VND)</label>
              <input 
                required
                type="number" 
                min="0"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Số ngày đi</label>
              <input 
                required
                type="number" 
                min="1"
                value={formData.durationDays}
                onChange={e => setFormData({...formData, durationDays: e.target.value})}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Mô tả ngắn</label>
            <textarea 
              rows="3"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '6px', background: 'var(--primary)', color: 'white', fontWeight: '600' }}>
              <Save size={16} /> Lưu Tour
            </button>
            <button type="button" onClick={() => setEditingId(null)} style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid #e2e8f0', fontWeight: '600' }}>
              Hủy
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}><Loader2 className="spin" size={32} /></div>
      ) : (
        <div className="table-container" style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Tên Tour</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Địa Danh</th>
                <th style={{ padding: '16px', textAlign: 'right', fontWeight: '600', color: '#475569' }}>Giá (VND)</th>
                <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', color: '#475569' }}>Thời gian</th>
                <th style={{ padding: '16px', textAlign: 'right', fontWeight: '600', color: '#475569' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {tours.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px', fontWeight: '600', color: '#0f172a' }}>{t.name}</td>
                  <td style={{ padding: '16px', color: '#64748b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} /> {t.destinationName}
                    </div>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right', fontWeight: '700', color: '#059669' }}>
                    {t.price.toLocaleString('vi-VN')}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center', color: '#64748b' }}>{t.durationDays} Ngày</td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button onClick={() => handleDelete(t.id)} style={{ color: '#ef4444', padding: '6px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.1)' }}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {tours.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                    Chưa có gói tour nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TourManager;
