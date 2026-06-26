import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { 
  ArrowLeft, Star, Send, ShieldCheck, User, Search,
  Ship, Compass, Flame, Wind, Navigation, MapPin, Utensils, Sparkles, Coffee, PenTool, Globe, Calendar
} from 'lucide-react';

// Maps string icons from seed to lucide components
const IconMap = {
  Ship, Compass, Flame, Wind, Navigation, MapPin, Utensils, Sparkles, Coffee, PenTool, Globe, Calendar
};

export const LandingPage = () => {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [localServices, setLocalServices] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review Form States
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // CTA Form States
  const [ctaName, setCtaName] = useState('');
  const [ctaPhone, setCtaPhone] = useState('');
  const [ctaSuccess, setCtaSuccess] = useState(false);

  useEffect(() => {
    fetchPageData();
  }, [id]);

  const fetchPageData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Destination core info
      const destData = await api.destinations.get(id);
      setDestination(destData);

      // 2. Fetch Dynamic Landing Page layout and styling config
      const configData = await api.landingPage.getConfig(destData.id);
      setConfig(configData);

      // 3. Fetch Local Services for this destination
      const svcData = await api.services.getAll({ destinationId: destData.id, limit: 100 });
      setLocalServices(svcData.data || []);
    } catch (err) {
      console.error('Failed to load landing page database:', err);
      setError('Không thể tải cấu hình Landing Page cho địa danh này.');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;

    setSubmittingReview(true);
    try {
      await api.destinations.addReview(destination.id, {
        authorName,
        rating,
        comment
      });
      setReviewSuccess(true);
      setAuthorName('');
      setComment('');
      setRating(5);
      
      // Reload page details to update average rating and testimonials feed
      const updatedDest = await api.destinations.get(destination.id);
      setDestination(updatedDest);
    } catch (err) {
      console.error('Failed to publish review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleCtaSubmit = (e) => {
    e.preventDefault();
    if (!ctaName.trim() || !ctaPhone.trim()) return;
    setCtaSuccess(true);
    setCtaName('');
    setCtaPhone('');
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh', flexDirection: 'column', gap: '16px', background: '#070913', color: 'white' }}>
        <Compass size={48} className="spin" style={{ color: '#0284c7', animation: 'spin 1.5s linear infinite' }} />
        <p style={{ color: '#94a3b8' }}>Đang kết xuất Landing Page cá nhân hóa...</p>
      </div>
    );
  }

  if (error || !destination || !config) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh', flexDirection: 'column', gap: '20px', background: '#070913', color: 'white' }}>
        <div style={{ textAlign: 'center', padding: '24px' }}>
          <p style={{ color: '#ef4444', fontSize: '18px', marginBottom: '16px' }}>{error || 'Không tìm thấy dữ liệu!'}</p>
          <Link to="/" className="btn btn-primary">
            <ArrowLeft size={16} /> Quay về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  // Get active theme class
  const themeSlug = 'vietravel'; // Override for Vietravel Design

  // Inject custom database overridden variables (colors & fonts) inline
  const styleOverrides = {
    ...(config.customPrimaryColor ? { '--primary': config.customPrimaryColor } : {}),
    ...(config.customSecondaryColor ? { '--secondary': config.customSecondaryColor } : {}),
    ...(config.customFontFamily ? { '--font-family': `'${config.customFontFamily}', sans-serif`, fontFamily: `'${config.customFontFamily}', sans-serif` } : {})
  };

  // Render individual sections dynamically
  const renderSection = (section) => {
    let content = {};
    try {
      content = JSON.parse(section.contentJson);
    } catch {
      content = {};
    }

    switch (section.sectionType) {
      case 'intro':
        return (
          <section key={section.id} className="theme-section">
            <div className="container">
              <div className="section-title-wrap">
                <h2 className="theme-sec-title">{section.title}</h2>
                {section.subtitle && <p className="theme-sec-subtitle">{section.subtitle}</p>}
              </div>

              <div className="intro-grid">
                <div className="intro-text">
                  {content.paragraphs && content.paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>

                <div className="stats-grid">
                  {content.stats && content.stats.map((stat, idx) => (
                    <div key={idx} className="stat-card">
                      <div className="stat-val">{stat.value}</div>
                      <div className="stat-lbl">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );

      case 'activities':
        return (
          <section key={section.id} className="theme-section" style={{ background: 'rgba(0,0,0,0.01)' }}>
            <div className="container">
              <div className="section-title-wrap">
                <h2 className="theme-sec-title">{section.title}</h2>
                {section.subtitle && <p className="theme-sec-subtitle">{section.subtitle}</p>}
              </div>

              <div className="activities-grid">
                {content.items && content.items.map((item, idx) => {
                  const IconComponent = IconMap[item.icon] || Compass;
                  return (
                    <div key={idx} className="act-card">
                      <div className="act-icon-wrap flex-center">
                        <IconComponent size={24} />
                      </div>
                      <h3 className="act-title">{item.title}</h3>
                      <p className="act-desc">{item.description}</p>
                      {item.duration && (
                        <div style={{ fontSize: '11px', color: 'var(--secondary)', fontWeight: '700', marginTop: '12px', textTransform: 'uppercase' }}>
                          ⏱ {item.duration}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );

      case 'gallery':
        return (
          <section key={section.id} className="theme-section">
            <div className="container">
              <div className="section-title-wrap">
                <h2 className="theme-sec-title">{section.title}</h2>
                {section.subtitle && <p className="theme-sec-subtitle">{section.subtitle}</p>}
              </div>

              <div className="gallery-masonry">
                {content.images && content.images.map((img, idx) => (
                  <div key={idx} className="gallery-item">
                    <img src={img.url} alt={img.caption || 'Gallery image'} />
                    <div className="gallery-cap">
                      <strong>{img.caption || 'Ảnh chụp lưu niệm'}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'cta':
        return (
          <section key={section.id} className="theme-section" style={{ padding: '60px 0 100px 0' }}>
            <div className="container">
              <div className="cta-panel">
                <h2 className="cta-title">{section.title}</h2>
                <p className="cta-subtitle">{section.subtitle}</p>

                {content.hasForm ? (
                  ctaSuccess ? (
                    <div className="flex-center" style={{ gap: '10px', background: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '30px', maxWidth: '500px', margin: '0 auto' }}>
                      <ShieldCheck size={20} />
                      <strong>Đăng ký thành công! Tư vấn viên của chúng tôi sẽ liên hệ trong 15 phút.</strong>
                    </div>
                  ) : (
                    <form onSubmit={handleCtaSubmit} className="cta-form">
                      <input 
                        type="text" 
                        required
                        placeholder={content.placeholderName || "Họ tên..."}
                        value={ctaName}
                        onChange={(e) => setCtaName(e.target.value)}
                      />
                      <input 
                        type="tel" 
                        required
                        placeholder={content.placeholderPhone || "Số điện thoại..."}
                        value={ctaPhone}
                        onChange={(e) => setCtaPhone(e.target.value)}
                      />
                      <button type="submit" className="cta-btn">
                        {content.buttonText || "Gửi đi"}
                      </button>
                    </form>
                  )
                ) : (
                  <button className="cta-btn">{content.buttonText || "Tìm hiểu thêm"}</button>
                )}
                {content.promoText && (
                  <p style={{ fontSize: '12px', opacity: 0.8, marginTop: '16px', fontStyle: 'italic' }}>
                    🎁 {content.promoText}
                  </p>
                )}
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`theme-wrapper theme-${themeSlug}`} style={styleOverrides}>
      
      {/* 1. Header Navigation Back Control */}
      <div style={{
        position: 'absolute',
        top: '24px',
        left: '24px',
        zIndex: 100,
        display: 'flex',
        gap: '12px'
      }}>
        <Link to="/" className="btn" style={{
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'white',
          borderRadius: '30px',
          padding: '8px 20px'
        }}>
          <ArrowLeft size={14} /> Quay về Bản đồ
        </Link>
      </div>

      {/* 2. Full Width Scenic Hero Cover */}
      <div 
        className="theme-hero" 
        style={{ backgroundImage: `url('${config.heroImageUrl || destination.coverUrl}')` }}
      >
        <div className="theme-hero-content">
          <h1 className="theme-hero-title">{config.heroTitle || destination.name}</h1>
          <p className="theme-hero-subtitle">{config.heroSubtitle || destination.description}</p>
        </div>

        {/* Floating Booking Widget Mockup */}
        <div className="booking-widget">
          <div className="booking-input-group">
            <MapPin size={20} color="var(--secondary)" />
            <input type="text" placeholder="Bạn muốn đi đâu?" defaultValue={destination.name} />
          </div>
          <div className="booking-input-group">
            <Calendar size={20} color="var(--secondary)" />
            <input type="text" placeholder="Ngày khởi hành" defaultValue="Ngày mai" />
          </div>
          <div className="booking-input-group">
            <User size={20} color="var(--secondary)" />
            <input type="text" placeholder="Số khách" defaultValue="2 Người lớn" />
          </div>
          <button className="booking-btn">
            <Search size={18} />
            Tìm Chuyến Đi
          </button>
        </div>
      </div>

      {/* 3. Ordered Configuration Layout Sections */}
      {config.sections && config.sections.map(section => renderSection(section))}

      {/* 4. Unified Reviews & Public Feedback Panel */}
      <section className="theme-section reviews-section" style={{ background: '#ffffff', color: 'var(--text-primary)' }}>
        <div className="container">
          <div className="section-title-wrap">
            <h2 className="theme-sec-title">Phản Hồi & Đánh Giá</h2>
            <p className="theme-sec-subtitle">Cảm nhận từ những hành khách đã đặt chân tới nơi đây</p>
          </div>

          <div className="reviews-grid">
            {destination.reviews && destination.reviews.map((rev) => (
              <div key={rev.id} className="review-card">
                <div className="review-item-header">
                  <div className="review-author" style={{ fontWeight: 'bold', fontSize: '16px' }}>{rev.authorName}</div>
                  <div className="review-stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} fill={i < rev.rating ? '#f59e0b' : 'none'} stroke="#f59e0b" />
                    ))}
                  </div>
                </div>
                <p className="review-comment" style={{ marginTop: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>"{rev.comment}"</p>
                <div className="review-date" style={{ marginTop: '16px', fontSize: '12px', color: '#94a3b8' }}>
                  📅 {new Date(rev.createdAt).toLocaleDateString('vi-VN')}
                </div>
              </div>
            ))}
          </div>

          {/* Post Review Form */}
          <div className="review-form-panel" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '16px', color: '#0f172a' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', textAlign: 'center' }}>
              Chia Sẻ Trải Nghiệm Của Bạn
            </h3>
            
            {reviewSuccess ? (
              <div className="flex-center" style={{ flexDirection: 'column', gap: '8px', color: '#059669', padding: '20px', textAlign: 'center' }}>
                <ShieldCheck size={36} />
                <strong>Cảm ơn bạn đã đóng góp đánh giá! Phản hồi đã được ghi nhận trực tiếp lên hệ thống.</strong>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '16px' }}>
                  <div className="form-group">
                    <label style={{ color: '#475569' }}>Tên của bạn</label>
                    <input 
                      type="text" 
                      required 
                      className="form-input" 
                      placeholder="Nhập tên..."
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      style={{ background: '#f8fafc', color: '#0f172a', border: '1px solid rgba(0,0,0,0.1)' }}
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ color: '#475569' }}>Đánh giá sao</label>
                    <select 
                      className="form-select"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      style={{ background: '#f8fafc', color: '#0f172a', border: '1px solid rgba(0,0,0,0.1)' }}
                    >
                      <option value={5}>5 Sao (Xuất sắc)</option>
                      <option value={4}>4 Sao (Rất tốt)</option>
                      <option value={3}>3 Sao (Bình thường)</option>
                      <option value={2}>2 Sao (Tệ)</option>
                      <option value={1}>1 Sao (Rất tệ)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label style={{ color: '#475569' }}>Ý kiến bình luận</label>
                  <textarea 
                    rows="3" 
                    required 
                    className="form-textarea" 
                    placeholder="Mô tả trải nghiệm thực tế..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    style={{ background: '#f8fafc', color: '#0f172a', border: '1px solid rgba(0,0,0,0.1)' }}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={submittingReview}
                  className="btn btn-primary" 
                  style={{ width: '100%', justifyContent: 'center', background: 'var(--primary)' }}
                >
                  <Send size={14} />
                  {submittingReview ? 'Đang gửi...' : 'Gửi Đánh Giá Ngay'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* NEW: Local Services Section */}
      {localServices.length > 0 && (
        <section className="theme-section" style={{ background: '#f8fafc' }}>
          <div className="container">
            <div className="section-title-wrap">
              <h2 className="theme-sec-title">Dịch vụ & Tiện ích tại {destination.name}</h2>
              <p className="theme-sec-subtitle">Khám phá các dịch vụ hàng đầu được Vietravel chọn lọc</p>
            </div>
            <div className="services-grid">
              {localServices.map(svc => (
                <div key={svc.id} className="service-card">
                  <div className="service-img-wrap">
                    <img src={svc.imageUrl} alt={svc.name} className="service-img" />
                    <span className="service-type-badge">
                      {svc.type === 'Homestay' ? 'Lưu trú' : svc.type === 'Restaurant' ? 'Ăn uống' : 'Di chuyển'}
                    </span>
                  </div>
                  <div className="service-content">
                    <h3 className="service-title">{svc.name}</h3>
                    <div className="service-location">
                      <MapPin size={14} /> {svc.address || destination.name}
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', flex: 1 }}>{svc.description}</p>
                    
                    <div className="service-footer">
                      <div className="service-rating">
                        <Star size={16} fill="#f59e0b" /> {svc.rating}
                      </div>
                      {svc.phone && <div className="service-price">Liên hệ</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
};
