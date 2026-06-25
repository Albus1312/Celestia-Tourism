import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { VietnamMap } from '../components/VietnamMap';
import { Search, MapPin, Star, Compass, Map, RefreshCw, Eye } from 'lucide-react';

export const Home = () => {
  const [destinations, setDestinations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeRegion, setActiveRegion] = useState(null);
  const [activeProvince, setActiveProvince] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMetadata();
    fetchDestinations();
  }, []);

  useEffect(() => {
    // Re-fetch destinations whenever filters change
    fetchDestinations();
  }, [activeCategory, activeRegion, activeProvince]);

  const fetchMetadata = async () => {
    try {
      const data = await api.destinations.getMetadata();
      setCategories(data.categories || []);
      setRegions(data.regions || []);
      setProvinces(data.provinces || []);
    } catch (err) {
      console.error('Failed to load filters metadata:', err);
    }
  };

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeCategory) params.category = activeCategory;
      if (activeRegion) params.region = activeRegion;
      if (activeProvince) params.province = activeProvince;
      if (searchQuery) params.search = searchQuery;

      const data = await api.destinations.list(params);
      setDestinations(data || []);
    } catch (err) {
      console.error('Failed to fetch destinations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchDestinations();
    }
  };

  const handleSelectRegion = (regionId) => {
    setActiveRegion(regionId);
    setActiveProvince(null); // Reset province filter when changing region
  };

  const handleSelectProvince = (provinceId) => {
    setActiveProvince(provinceId);
    // Find matching region for this province to highlight map
    const prov = provinces.find(p => p.id === provinceId);
    if (prov) {
      setActiveRegion(prov.regionId);
    }
  };

  const resetAllFilters = () => {
    setActiveCategory(null);
    setActiveRegion(null);
    setActiveProvince(null);
    setSearchQuery('');
  };

  const getRegionName = (id) => {
    const r = regions.find(item => item.id === id);
    return r ? r.name : 'Việt Nam';
  };

  const getRegionDesc = (id) => {
    const r = regions.find(item => item.id === id);
    return r ? r.description : 'Khám phá những điểm đến du lịch tuyệt vời nhất trải dọc khắp dải đất hình chữ S.';
  };

  return (
    <div className="main-content">
      {/* 1. Glassmorphic Immersive Hero Section */}
      <section 
        className="hero-slider" 
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=80')` }}
      >
        <div className="container">
          <div className="hero-content">
            <span className="map-tag" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', marginBottom: '16px' }}>
              ✦ CELESTIA TOURISM PLATFORM
            </span>
            <h1 className="hero-title">Bản Đồ Kỳ Quan Việt Nam</h1>
            <p className="hero-subtitle">
              Hệ thống quản lý, quảng bá và trình diễn landing page cá nhân hóa đặc trưng cho từng danh lam thắng cảnh trên toàn quốc.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <a href="#discovery" className="btn btn-primary">
                Khám Phá Địa Điểm
              </a>
              <button onClick={() => handleSelectRegion('bac-bo')} className="btn btn-secondary">
                Xem Miền Bắc
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive SVG Map & Region Overview */}
      <section className="map-section">
        <div className="container">
          <div className="map-grid">
            {/* SVG Map (interactive) */}
            <VietnamMap 
              activeRegion={activeRegion}
              onSelectRegion={handleSelectRegion}
              activeProvince={activeProvince}
              onSelectProvince={handleSelectProvince}
            />

            {/* Region Details Info Panel */}
            <div className="map-info-panel">
              <span className="map-tag">
                🌍 BẢN ĐỒ SỐ TƯƠNG TÁC
              </span>
              
              <div className="region-detail-card">
                <h2 className="region-title text-gradient">
                  {activeRegion ? getRegionName(activeRegion) : 'Tất cả các Miền'}
                </h2>
                <p className="region-description">
                  {activeRegion ? getRegionDesc(activeRegion) : getRegionDesc(null)}
                </p>

                <div className="region-stats-mini">
                  <div className="mini-stat-item">
                    <div className="mini-stat-value">63</div>
                    <div className="mini-stat-label">Tỉnh / Thành</div>
                  </div>
                  <div className="mini-stat-item">
                    <div className="mini-stat-value">
                      {activeRegion ? destinations.length : '3+'}
                    </div>
                    <div className="mini-stat-label">Hotspots Đã Dựng</div>
                  </div>
                  <div className="mini-stat-item">
                    <div className="mini-stat-value">4.9 ★</div>
                    <div className="mini-stat-label">Đánh giá TB</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontSize: '15px', color: '#94a3b8' }}>💡 Hướng dẫn nhanh báo cáo tiến độ:</h4>
                <div style={{ fontSize: '13px', color: '#64748b', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <li>
                      <strong>Tương tác bản đồ:</strong> Nhấp vào 3 miền để lọc nhanh địa danh, hoặc nhấp các <strong>chốt ghim đỏ</strong> nhấp nháy (như Sa Pa, Hạ Long, Hội An) để lọc theo tỉnh.
                    </li>
                    <li>
                      <strong>Trình diễn Landing Page động:</strong> Click <strong>"Xem trang chi tiết"</strong> tại mỗi card để xem cơ chế tạo giao diện đặc trưng (Ocean Breeze, Heritage Gold, Mountain Mist).
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Catalog Discovery Grid */}
      <section id="discovery" style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '38px', fontWeight: '800', marginBottom: '12px' }}>Danh Sách Địa Điểm Trình Diễn</h2>
            <p style={{ color: '#94a3b8' }}>Khám phá các kỳ quan và tùy biến trang đích cá nhân hóa</p>
          </div>

          {/* Filter Bar with search and categories */}
          <div className="filter-bar">
            <div className="category-tabs">
              <button 
                onClick={() => setActiveCategory(null)}
                className={`cat-tab ${activeCategory === null ? 'active' : ''}`}
              >
                Tất Cả
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`cat-tab ${activeCategory === cat.slug ? 'active' : ''}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div className="search-input-wrapper">
                <Search size={18} style={{ color: '#64748b', marginRight: '8px' }} />
                <input 
                  type="text" 
                  className="search-input"
                  placeholder="Tìm tên, vị trí..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
              </div>

              {/* Dropdown Filters */}
              <select 
                className="form-input" 
                style={{ width: 'auto', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '30px', padding: '10px 20px' }}
                value={activeRegion || ''}
                onChange={(e) => handleSelectRegion(e.target.value || null)}
              >
                <option value="" style={{ color: 'black' }}>Tất cả các Miền</option>
                {regions.map(r => (
                  <option key={r.id} value={r.id} style={{ color: 'black' }}>{r.name}</option>
                ))}
              </select>

              <select 
                className="form-input" 
                style={{ width: 'auto', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '30px', padding: '10px 20px' }}
                value={activeProvince || ''}
                onChange={(e) => handleSelectProvince(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="" style={{ color: 'black' }}>Tất cả Tỉnh/Thành</option>
                {provinces.filter(p => !activeRegion || p.regionId === activeRegion).map(p => (
                  <option key={p.id} value={p.id} style={{ color: 'black' }}>{p.name}</option>
                ))}
              </select>

              {(activeCategory || activeRegion || activeProvince || searchQuery) && (
                <button onClick={resetAllFilters} className="btn btn-secondary" style={{ padding: '10px 14px', borderRadius: '30px' }}>
                  <RefreshCw size={14} />
                  Xóa Lọc
                </button>
              )}
            </div>
          </div>

          {/* Catalog items loader */}
          {loading ? (
            <div className="flex-center" style={{ minHeight: '300px', flexDirection: 'column', gap: '16px' }}>
              <RefreshCw size={36} className="spin" style={{ color: 'var(--accent)', animation: 'spin 1.5s linear infinite' }} />
              <p style={{ color: '#64748b' }}>Đang kết nối cơ sở dữ liệu Celestia...</p>
            </div>
          ) : destinations.length === 0 ? (
            <div className="flex-center" style={{ minHeight: '300px', background: 'rgba(255,255,255,0.01)', borderRadius: '16px', border: '1px dashed var(--border-color)' }}>
              <div style={{ textAlign: 'center' }}>
                <Compass size={48} style={{ color: '#64748b', marginBottom: '16px' }} />
                <p style={{ color: '#94a3b8', fontSize: '16px' }}>Không tìm thấy địa điểm du lịch nào phù hợp bộ lọc.</p>
                <button onClick={resetAllFilters} className="btn btn-primary" style={{ marginTop: '16px' }}>Tải lại mặc định</button>
              </div>
            </div>
          ) : (
            <div className="destinations-grid">
              {destinations.map((dest) => (
                <div key={dest.id} className="dest-card">
                  <div className="dest-card-image">
                    <img src={dest.thumbnailUrl} alt={dest.name} />
                    <span className="dest-card-badge">{dest.categoryName}</span>
                    <span className="dest-card-rating">
                      <Star size={12} fill="#f59e0b" stroke="#f59e0b" />
                      {dest.rating}
                    </span>
                  </div>

                  <div className="dest-card-body">
                    <h3 className="dest-card-title">{dest.name}</h3>
                    <div className="dest-card-loc">
                      <MapPin size={13} style={{ color: 'var(--accent)' }} />
                      <span>{dest.location}</span>
                    </div>
                    <p className="dest-card-desc">{dest.description}</p>

                    <div className="dest-card-footer">
                      <span className="dest-card-theme-lbl">
                        🎨 Theme: <strong>{dest.themeId === 'ocean-breeze' ? 'Đại Dương' : dest.themeId === 'heritage-gold' ? 'Hoàng Triều' : 'Sương Núi'}</strong>
                      </span>
                      <Link to={`/landingpage/${dest.id}`} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
                        <Eye size={14} />
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
