import React, { useState, useEffect } from 'react';
import { api, API_BASE_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MessageCircle, Heart, Share2, MapPin, Calendar, Compass, Send, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CommunityPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [destinations, setDestinations] = useState([]);

  // New post state
  const [content, setContent] = useState('');
  const [selectedDestId, setSelectedDestId] = useState('');
  const [isLookingForCompanion, setIsLookingForCompanion] = useState(false);
  const [travelDate, setTravelDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPosts();
    fetchDestinations();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/social/posts`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDestinations = async () => {
    try {
      const data = await api.destinations.list();
      setDestinations(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      const payload = {
        content,
        userId: user ? user.id : 0,
        destinationId: selectedDestId ? parseInt(selectedDestId) : null,
        isLookingForCompanion,
        travelDate: travelDate || null
      };

      const res = await fetch(`${API_BASE_URL}/social/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setContent('');
        setSelectedDestId('');
        setIsLookingForCompanion(false);
        setTravelDate('');
        fetchPosts(); // Refresh feed
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/social/posts/${postId}/like?userId=${user?.id || 1}`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, likesCount: data.likes } : p));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
          Cộng Đồng Du Lịch
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Nơi chia sẻ khoảnh khắc, tìm kiếm bạn đồng hành trên mọi nẻo đường Việt Nam.</p>
      </div>

      {/* Create Post Box */}
      <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
        <form onSubmit={handleCreatePost}>
          <textarea
            required
            placeholder="Bạn đang nghĩ gì về chuyến đi sắp tới?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-primary)', resize: 'none', marginBottom: '16px' }}
            rows="3"
          />
          
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <select
              value={selectedDestId}
              onChange={(e) => setSelectedDestId(e.target.value)}
              style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-primary)' }}
            >
              <option value="">-- Gắn thẻ Địa danh (Tùy chọn) --</option>
              {destinations.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={isLookingForCompanion}
                onChange={(e) => setIsLookingForCompanion(e.target.checked)}
              />
              Tìm bạn đồng hành
            </label>
            
            {isLookingForCompanion && (
              <input 
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-primary)' }}
              />
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              type="submit" 
              disabled={submitting}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', borderRadius: '24px' }}
            >
              <Send size={16} /> Đăng Bài
            </button>
          </div>
        </form>
      </div>

      {/* Feed */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}><Compass className="spin" size={40} color="var(--accent)" /></div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: 'var(--bg-panel)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <p style={{ color: 'var(--text-muted)' }}>Chưa có bài đăng nào. Hãy là người đầu tiên chia sẻ!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {posts.map(post => (
            <div key={post.id} style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px' }}>
              
              {/* Post Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <UserIcon size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)' }}>{post.authorName}</h4>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{new Date(post.createdAt).toLocaleString('vi-VN')}</span>
                  </div>
                </div>
                
                {post.isLookingForCompanion && (
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={14} /> Tìm Bạn Đồng Hành
                  </div>
                )}
              </div>

              {/* Post Content */}
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px', whiteSpace: 'pre-wrap' }}>
                {post.content}
              </p>

              {/* Tags/Meta */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                {post.destinationName && (
                  <Link to={`/landingpage/${post.destinationId}`} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', background: 'rgba(2, 132, 199, 0.1)', padding: '6px 12px', borderRadius: '20px' }}>
                    <MapPin size={14} /> {post.destinationName}
                  </Link>
                )}
                {post.travelDate && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--text-muted)', background: 'var(--bg-app)', padding: '6px 12px', borderRadius: '20px' }}>
                    <Calendar size={14} /> Đi vào: {new Date(post.travelDate).toLocaleDateString('vi-VN')}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <button 
                  onClick={() => handleLike(post.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'color 0.2s' }}
                  className="social-action-btn"
                >
                  <Heart size={18} /> {post.likesCount}
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }} className="social-action-btn">
                  <MessageCircle size={18} /> {post.commentsCount}
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }} className="social-action-btn">
                  <Share2 size={18} /> Chia sẻ
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

const Users = ({size}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
