import React, { useState, useEffect } from 'react';
import { api, API_BASE_URL } from '../../services/api';
import { Plus, Trash2, Edit2, Loader2, Save, FileText, Image as ImageIcon } from 'lucide-react';

const ArticleManager = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    thumbnailUrl: ''
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      // In a real app we'd have a wrapper for articles in api.js
      const res = await fetch(`${API_BASE_URL}/articles`);
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/articles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormData({ title: '', content: '', thumbnailUrl: '' });
        setEditingId(null);
        fetchArticles();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa bài viết này?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/articles/${id}`, { method: 'DELETE' });
      if (res.ok) fetchArticles();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800' }}>Quản Lý Bài Viết</h2>
        <button 
          onClick={() => setEditingId('new')}
          className="admin-btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', background: 'var(--primary)', color: 'white', fontWeight: 'bold' }}
        >
          <Plus size={18} /> Đăng Bài Mới
        </button>
      </div>

      {editingId === 'new' && (
        <form onSubmit={handleSave} style={{ background: 'white', padding: '24px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Đăng Bài Viết</h3>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Tiêu đề</label>
            <input 
              required
              type="text" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Ảnh bìa (URL)</label>
            <input 
              type="text" 
              value={formData.thumbnailUrl}
              onChange={e => setFormData({...formData, thumbnailUrl: e.target.value})}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>Nội dung HTML / Văn bản</label>
            <textarea 
              required
              rows="6"
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', fontFamily: 'monospace' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '6px', background: 'var(--primary)', color: 'white', fontWeight: '600' }}>
              <Save size={16} /> Lưu Bài
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {articles.map(art => (
            <div key={art.id} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              {art.thumbnailUrl ? (
                <div style={{ height: '160px', backgroundImage: `url(${art.thumbnailUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              ) : (
                <div style={{ height: '160px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                  <ImageIcon size={48} />
                </div>
              )}
              <div style={{ padding: '16px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{art.title}</h4>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Đăng bởi: {art.authorName} • {new Date(art.createdAt).toLocaleDateString('vi-VN')}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={() => handleDelete(art.id)} style={{ color: '#ef4444', padding: '6px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.1)' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {articles.length === 0 && <p style={{ color: '#64748b' }}>Chưa có bài viết nào.</p>}
        </div>
      )}
    </div>
  );
};

export default ArticleManager;
