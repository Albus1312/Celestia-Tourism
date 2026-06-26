import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api, API_BASE_URL } from '../services/api';
import { 
  BarChart3, Settings, Eye, MessageSquare, Star, Palette, Type, Heading, Image, 
  ArrowUp, ArrowDown, Save, Compass, FileText, CheckCircle2, AlertTriangle, Monitor, Smartphone, Tablet, Database, Loader2, Coffee, Users, Trash2, Plus, PenTool, Navigation
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import DestinationManager from '../components/admin/DestinationManager';
import ServiceManager from '../components/admin/ServiceManager';
import UserManager from '../components/admin/UserManager';
import ArticleManager from '../components/admin/ArticleManager';
import TourManager from '../components/admin/TourManager';

export const AdminDashboard = () => {
  const { user } = useAuth();
  
  // Dashboard navigation states - Editor defaults directly to builder workspace
  const [activeTab, setActiveTab] = useState(user?.role === 'Editor' ? 'builder' : 'analytics'); // 'analytics' | 'builder'
  
  // Analytics State
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  // Builder States
  const [destinations, setDestinations] = useState([]);
  const [themes, setThemes] = useState([]);
  const [selectedDestId, setSelectedDestId] = useState('');
  const [builderConfig, setBuilderConfig] = useState(null);
  const [builderLoading, setBuilderLoading] = useState(false);
  const [builderSuccess, setBuilderSuccess] = useState(false);
  const [builderError, setBuilderError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Active Section accordion in builder
  const [expandedSectionId, setExpandedSectionId] = useState(null);

  useEffect(() => {
    if (user?.role === 'Admin') {
      fetchAnalytics();
    }
    fetchBuilderMeta();
  }, [user]);

  useEffect(() => {
    if (selectedDestId) {
      loadDestinationConfig(selectedDestId);
    } else {
      setBuilderConfig(null);
    }
  }, [selectedDestId]);

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const data = await api.analytics.getOverview();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const fetchBuilderMeta = async () => {
    try {
      const destList = await api.destinations.list();
      setDestinations(destList || []);
      const themeList = await api.landingPage.getThemes();
      setThemes(themeList || []);
    } catch (err) {
      console.error('Failed to load builder metadata:', err);
    }
  };

  const loadDestinationConfig = async (destId) => {
    setBuilderLoading(true);
    setBuilderSuccess(false);
    setBuilderError('');
    try {
      const configData = await api.landingPage.getConfig(destId);
      // Parse section JSON strings into objects for easier form binding
      const formattedSections = (configData.sections || []).map(sec => ({
        ...sec,
        parsedContent: JSON.parse(sec.contentJson || '{}')
      }));
      
      setBuilderConfig({
        ...configData,
        sections: formattedSections
      });
    } catch (err) {
      setBuilderError('Không thể lấy cấu hình của địa điểm.');
    } finally {
      setBuilderLoading(false);
    }
  };

  const handleConfigChange = (field, value) => {
    setBuilderConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const res = await api.upload.image(file);
      const url = API_BASE_URL.replace('/api', '') + res.url;
      handleConfigChange('heroImageUrl', url);
    } catch (err) {
      alert('Lỗi upload ảnh: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSectionChange = (sectionId, field, value) => {
    setBuilderConfig(prev => {
      const updatedSections = prev.sections.map(sec => {
        if (sec.id === sectionId) {
          return { ...sec, [field]: value };
        }
        return sec;
      });
      return { ...prev, sections: updatedSections };
    });
  };

  const handleParsedContentChange = (sectionId, key, value, subIndex = null, subKey = null) => {
    setBuilderConfig(prev => {
      const updatedSections = prev.sections.map(sec => {
        if (sec.id === sectionId) {
          let updatedContent = { ...sec.parsedContent };
          
          if (subIndex !== null && subKey !== null) {
            // Nested array structure (e.g. stats list or activities list)
            const updatedArray = [...(updatedContent[key] || [])];
            updatedArray[subIndex] = {
              ...updatedArray[subIndex],
              [subKey]: value
            };
            updatedContent[key] = updatedArray;
          } else {
            updatedContent[key] = value;
          }
          
          return { 
            ...sec, 
            parsedContent: updatedContent,
            contentJson: JSON.stringify(updatedContent)
          };
        }
        return sec;
      });
      return { ...prev, sections: updatedSections };
    });
  };

  const addSection = () => {
    const newSection = {
      id: Math.random().toString(36).substr(2, 9),
      sectionType: 'text',
      title: 'Khối nội dung mới',
      subtitle: '',
      orderIndex: builderConfig.sections ? builderConfig.sections.length : 0,
      parsedContent: {}
    };
    setBuilderConfig(prev => ({
      ...prev,
      sections: [...(prev.sections || []), newSection]
    }));
    setExpandedSectionId(newSection.id);
  };

  const deleteSection = (sectionId, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Bạn có chắc muốn xóa khối này?')) return;
    setBuilderConfig(prev => ({
      ...prev,
      sections: prev.sections.filter(sec => sec.id !== sectionId)
    }));
  };

  const moveSection = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === builderConfig.sections.length - 1) return;

    const newSections = [...builderConfig.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap positions
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    // Reset sortOrder sequence
    const orderedSections = newSections.map((sec, idx) => ({
      ...sec,
      sortOrder: idx + 1
    }));

    setBuilderConfig(prev => ({
      ...prev,
      sections: orderedSections
    }));
  };

  const handleSaveConfig = async () => {
    setBuilderLoading(true);
    setBuilderSuccess(false);
    setBuilderError('');
    try {
      // Re-serialize parsedContents back into contentJson string before saving
      const payload = {
        themeId: builderConfig.themeId,
        heroTitle: builderConfig.heroTitle,
        heroSubtitle: builderConfig.heroSubtitle,
        heroImageUrl: builderConfig.heroImageUrl,
        heroVideoUrl: builderConfig.heroVideoUrl,
        customPrimaryColor: builderConfig.customPrimaryColor,
        customSecondaryColor: builderConfig.customSecondaryColor,
        customFontFamily: builderConfig.customFontFamily,
        sections: builderConfig.sections.map(sec => ({
          id: sec.id,
          sectionType: sec.sectionType,
          title: sec.title,
          subtitle: sec.subtitle,
          contentJson: JSON.stringify(sec.parsedContent),
          sortOrder: sec.sortOrder
        }))
      };

      await api.landingPage.saveConfig(selectedDestId, payload);
      setBuilderSuccess(true);
      
      // Reload updated config
      loadDestinationConfig(selectedDestId);
    } catch (err) {
      setBuilderError(err.message || 'Có lỗi xảy ra khi lưu cấu hình.');
    } finally {
      setBuilderLoading(false);
    }
  };

  return (
    <div className="admin-container">
      {/* Sidebar Controls */}
      <aside className="admin-sidebar">
        <div style={{ padding: '0 16px 20px 16px', borderBottom: '1px solid var(--border-color)', marginBottom: '20px' }}>
          <h4 style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Phân Hệ Admin</h4>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>Báo cáo tiến độ: <strong>Celestia v1.0</strong></p>
        </div>

        {user?.role === 'Admin' && (
          <>
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`admin-menu-item ${activeTab === 'analytics' ? 'active' : ''}`}
            >
              <BarChart3 size={16} />
              Báo Cáo Tiến Độ
            </button>
            <button 
              onClick={() => setActiveTab('masterdata')}
              className={`admin-menu-item ${activeTab === 'masterdata' ? 'active' : ''}`}
            >
              <Database size={16} />
              Quản lý Địa điểm
            </button>
            <button 
              onClick={() => setActiveTab('services')}
              className={`admin-menu-item ${activeTab === 'services' ? 'active' : ''}`}
            >
              <Coffee size={16} />
              Quản lý Dịch vụ
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`admin-menu-item ${activeTab === 'users' ? 'active' : ''}`}
            >
              <Users size={16} />
              Quản lý Tài khoản
            </button>
            <button 
              onClick={() => setActiveTab('tours')}
              className={`admin-menu-item ${activeTab === 'tours' ? 'active' : ''}`}
            >
              <Navigation size={16} />
              Quản lý Tour Đặt Chỗ
            </button>
          </>
        )}

        <button 
          onClick={() => setActiveTab('articles')}
          className={`admin-menu-item ${activeTab === 'articles' ? 'active' : ''}`}
        >
          <FileText size={16} />
          Quản lý Bài viết
        </button>

        <button 
          onClick={() => setActiveTab('builder')}
          className={`admin-menu-item ${activeTab === 'builder' ? 'active' : ''}`}
        >
          <Settings size={16} />
          Visual Page Builder
        </button>
      </aside>

      {/* Main Admin Panels Body */}
      <main className="admin-body">
        
        {/* ACCESS DENIED FOR NON-ADMINS */}
        {(activeTab === 'analytics' || activeTab === 'masterdata' || activeTab === 'services' || activeTab === 'users') && user?.role !== 'Admin' && (
          <div className="glass-panel" style={{ padding: '48px', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center', margin: '40px auto', maxWidth: '600px' }}>
            <AlertTriangle size={48} style={{ color: '#ef4444', marginBottom: '20px', marginInline: 'auto' }} />
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>Quyền Hạn Hạn Chế</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
              Vai trò của bạn là <strong style={{ color: 'var(--accent)' }}>Editor</strong>. Bạn chỉ có quyền truy cập vào mục <strong>Visual Page Builder</strong> để hiệu chỉnh nội dung và giao diện Landing Page, không thể xem mục này.
            </p>
          </div>
        )}

        {/* PANEL: MASTER DATA */}
        {activeTab === 'masterdata' && user?.role === 'Admin' && (
          <DestinationManager />
        )}

        {/* PANEL: SERVICES */}
        {activeTab === 'services' && user?.role === 'Admin' && (
          <ServiceManager />
        )}

        {/* PANEL: USERS */}
        {activeTab === 'users' && user?.role === 'Admin' && (
          <UserManager />
        )}

        {/* PANEL: TOURS */}
        {activeTab === 'tours' && user?.role === 'Admin' && (
          <TourManager />
        )}

        {/* PANEL: ARTICLES */}
        {activeTab === 'articles' && (
          <ArticleManager />
        )}

        {/* PANEL A: ANALYTICS COCKPIT */}
        {activeTab === 'analytics' && user?.role === 'Admin' && (
          <div>
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>Báo Cáo Tiến Độ Hệ Thống</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Số liệu trực quan hóa lưu lượng và mức độ tương tác trực tiếp của người dùng.</p>
            </div>

            {analyticsLoading ? (
              <div className="flex-center" style={{ minHeight: '300px' }}>
                <Compass className="spin" size={32} style={{ color: 'var(--accent)', animation: 'spin 1.5s linear infinite' }} />
              </div>
            ) : !analytics ? (
              <p style={{ color: '#ef4444' }}>Không tải được số liệu phân tích.</p>
            ) : (
              <>
                {/* Metric cards grid */}
                <div className="stats-grid-4">
                  <div className="dashboard-stat-card">
                    <div className="stat-icon-wrap"><Compass /></div>
                    <div>
                      <div className="mini-stat-label">Địa Danh Du Lịch</div>
                      <div className="mini-stat-value">{analytics.totalDestinations}</div>
                    </div>
                  </div>
                  <div className="dashboard-stat-card">
                    <div className="stat-icon-wrap" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)' }}><Eye /></div>
                    <div>
                      <div className="mini-stat-label">Tổng Lượt Xem</div>
                      <div className="mini-stat-value">{analytics.totalViews}</div>
                    </div>
                  </div>
                  <div className="dashboard-stat-card">
                    <div className="stat-icon-wrap" style={{ color: '#ec4899', background: 'rgba(236, 72, 153, 0.1)' }}><MessageSquare /></div>
                    <div>
                      <div className="mini-stat-label">Đóng Góp Ý Kiến</div>
                      <div className="mini-stat-value">{analytics.totalReviews}</div>
                    </div>
                  </div>
                  <div className="dashboard-stat-card">
                    <div className="stat-icon-wrap" style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)' }}><Star /></div>
                    <div>
                      <div className="mini-stat-label">Điểm Đánh Giá TB</div>
                      <div className="mini-stat-value">{analytics.averageRating} ★</div>
                    </div>
                  </div>
                  <div className="dashboard-stat-card">
                    <div className="stat-icon-wrap" style={{ color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.1)' }}><Users /></div>
                    <div>
                      <div className="mini-stat-label">Tổng Người Dùng</div>
                      <div className="mini-stat-value">{analytics.totalUsers}</div>
                    </div>
                  </div>
                  <div className="dashboard-stat-card">
                    <div className="stat-icon-wrap" style={{ color: '#0ea5e9', background: 'rgba(14, 165, 233, 0.1)' }}><PenTool /></div>
                    <div>
                      <div className="mini-stat-label">Bài Viết (Blog)</div>
                      <div className="mini-stat-value">{analytics.totalArticles}</div>
                    </div>
                  </div>
                  <div className="dashboard-stat-card">
                    <div className="stat-icon-wrap" style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)' }}><Navigation /></div>
                    <div>
                      <div className="mini-stat-label">Tổng Số Tour</div>
                      <div className="mini-stat-value">{analytics.totalTours}</div>
                    </div>
                  </div>
                </div>

                {/* Charts Area */}
                <div className="dashboard-chart-grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '24px', marginTop: '24px' }}>
                  
                  {/* Past 30 Days views line chart with Recharts */}
                  <div className="chart-card">
                    <div className="chart-header">
                      <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Biểu Đồ Lưu Lượng (30 Ngày Qua)</h3>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Đơn vị: Lượt truy cập / ngày</span>
                    </div>

                    <div style={{ height: '300px', width: '100%', marginTop: '20px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analytics.viewsOverTime}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis 
                            dataKey="date" 
                            tickFormatter={(tick) => tick.substring(8, 10) + '/' + tick.substring(5, 7)}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#64748b' }}
                            dy={10}
                          />
                          <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#64748b' }}
                            dx={-10}
                          />
                          <RechartsTooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            labelFormatter={(label) => new Date(label).toLocaleDateString('vi-VN')}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="views" 
                            stroke="#3b82f6" 
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Device breakdown PieChart */}
                  <div className="chart-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div>
                      <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '16px' }}>Phân Phối Thiết Bị</h3>
                      <div style={{ height: '220px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={analytics.deviceDistribution}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="count"
                              nameKey="device"
                            >
                              {analytics.deviceDistribution.map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={entry.device === 'desktop' ? '#3b82f6' : entry.device === 'mobile' ? '#10b981' : '#f59e0b'} 
                                />
                              ))}
                            </Pie>
                            <RechartsTooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      
                      {/* Legend */}
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        {analytics.deviceDistribution.map((item, idx) => {
                          const total = analytics.deviceDistribution.reduce((acc, curr) => acc + curr.count, 0) || 1;
                          const pct = Math.round((item.count / total) * 100);
                          const colors = { desktop: '#3b82f6', mobile: '#10b981', tablet: '#f59e0b' };
                          return (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: colors[item.device] || '#3b82f6' }}></div>
                              <span style={{ textTransform: 'capitalize' }}>{item.device}: {pct}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                      <h3 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '12px' }}>Khu Vực Truy Cập Phổ Biến</h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {analytics.regionDistribution.map((item, idx) => (
                          <div key={idx} style={{
                            fontSize: '12px',
                            background: 'var(--border-color-hover)',
                            border: '1px solid var(--border-color)',
                            padding: '6px 12px',
                            borderRadius: '30px'
                          }}>
                            <strong>{item.region}</strong>: {item.count} views
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Popular hotspots table */}
                <div className="chart-card">
                  <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Hiệu Suất Địa Danh Nổi Bật</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '12px 16px' }}>Tên địa danh</th>
                        <th style={{ padding: '12px 16px' }}>Tổng Views</th>
                        <th style={{ padding: '12px 16px' }}>Bình luận</th>
                        <th style={{ padding: '12px 16px' }}>Điểm đánh giá</th>
                        <th style={{ padding: '12px 16px' }}>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.popularDestinations.map((dest, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--border-color-hover)' }}>
                          <td style={{ padding: '16px', fontWeight: '600' }}>{dest.name}</td>
                          <td style={{ padding: '16px' }}>👀 {dest.views}</td>
                          <td style={{ padding: '16px' }}>💬 {dest.reviewsCount}</td>
                          <td style={{ padding: '16px', color: '#f59e0b', fontWeight: '700' }}>★ {dest.rating}</td>
                          <td style={{ padding: '16px' }}>
                            <span style={{ fontSize: '11px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '2px 8px', borderRadius: '4px' }}>
                              Đang hoạt động
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* PANEL B: PAGE BUILDER ENGINE (VISUAL PREVIEW WORKSPACE) */}
        {activeTab === 'builder' && (
          <div>
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>Visual Page Builder Workspace</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Biên tập giao diện, màu sắc, font chữ và sắp xếp các khối nội dung Landing Page tức thì.</p>
            </div>

            {/* Select Destination Selector */}
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px', border: '1px solid var(--border-color)', marginBottom: '32px', display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Chọn địa điểm muốn biên tập cấu hình:</label>
                <select 
                  className="form-select" 
                  value={selectedDestId}
                  onChange={(e) => setSelectedDestId(e.target.value)}
                >
                  <option value="">-- Chọn danh lam thắng cảnh --</option>
                  {destinations.map(d => (
                    <option key={d.id} value={d.id}>{d.name} (Theme: {d.themeId})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Builder Workspace Split grid */}
            {!selectedDestId ? (
              <div className="flex-center" style={{ minHeight: '300px', background: 'var(--bg-app)', border: '1px dashed var(--border-color)', borderRadius: '16px' }}>
                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Palette size={48} style={{ marginBottom: '16px' }} />
                  <p>Vui lòng lựa chọn một địa điểm ở trên để mở Cockpit hiệu chỉnh.</p>
                </div>
              </div>
            ) : builderLoading && !builderConfig ? (
              <div className="flex-center" style={{ minHeight: '300px' }}>
                <Compass className="spin" size={32} style={{ color: 'var(--accent)', animation: 'spin 1.5s linear infinite' }} />
              </div>
            ) : builderConfig ? (
              <div className="builder-workspace">
                
                {/* Control Panel Forms (Left) */}
                <div className="builder-controls">
                  <h3 className="builder-title text-gradient">Hiệu chỉnh tham số</h3>

                  {builderSuccess && (
                    <div style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      color: '#34d399',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <CheckCircle2 size={16} />
                      <span>Đã đồng bộ lưu cấu hình lên DB PostgreSQL thành công!</span>
                    </div>
                  )}

                  {builderError && (
                    <div style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      color: '#f87171',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <AlertTriangle size={16} />
                      <span>{builderError}</span>
                    </div>
                  )}

                  {/* 1. Brand Visual Theme Preset */}
                  <div className="form-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Palette size={14} style={{ color: 'var(--accent)' }} />
                      Phong cách Chủ Đề (Theme Preset)
                    </label>
                    <select 
                      className="form-select"
                      value={builderConfig.themeId}
                      onChange={(e) => handleConfigChange('themeId', e.target.value)}
                    >
                      {themes.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* 2. Color Variable overrides */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        Màu chính (Primary)
                      </label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={builderConfig.customPrimaryColor || ''}
                        onChange={(e) => handleConfigChange('customPrimaryColor', e.target.value)}
                        placeholder="Mặc định HSL / Hex"
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        Màu phụ (Secondary)
                      </label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={builderConfig.customSecondaryColor || ''}
                        onChange={(e) => handleConfigChange('customSecondaryColor', e.target.value)}
                        placeholder="Mặc định HSL / Hex"
                      />
                    </div>
                  </div>

                  {/* 3. Typography override */}
                  <div className="form-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Type size={14} />
                      Font chữ Overrides (Google Fonts)
                    </label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={builderConfig.customFontFamily || ''}
                      onChange={(e) => handleConfigChange('customFontFamily', e.target.value)}
                      placeholder="Ví dụ: Inter, Outfit, Playfair Display..."
                    />
                  </div>

                  {/* 4. Full Hero Panel Configs */}
                  <div style={{ background: 'var(--bg-card-hover)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '700', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                      🚩 Khối Bìa (Hero Cover Section)
                    </h4>
                    
                    <div className="form-group">
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Heading size={13} /> Tiêu đề bìa</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={builderConfig.heroTitle || ''}
                        onChange={(e) => handleConfigChange('heroTitle', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Phụ đề bìa</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={builderConfig.heroSubtitle || ''}
                        onChange={(e) => handleConfigChange('heroSubtitle', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Image size={13} /> Link ảnh nền bìa (Cover URL)</label>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input 
                          type="text" 
                          className="form-input" 
                          style={{ flex: 1 }}
                          value={builderConfig.heroImageUrl || ''}
                          onChange={(e) => handleConfigChange('heroImageUrl', e.target.value)}
                        />
                        <label style={{ cursor: 'pointer', background: 'var(--accent)', color: 'white', padding: '8px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          {uploadingImage ? <Loader2 size={16} className="animate-spin" /> : <Image size={16} />}
                          Tải lên
                          <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* 5. Re-orderable list sections */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '700' }}>⚙️ Sắp xếp & Hiệu chỉnh Khối Nội Dung (Sections)</h4>
                    
                    {builderConfig.sections.map((sec, idx) => (
                      <div key={sec.id || idx} className="section-builder-card">
                        
                        <div 
                          className="section-builder-header"
                          onClick={() => setExpandedSectionId(expandedSectionId === sec.id ? null : sec.id)}
                        >
                          <span style={{ fontSize: '13px', fontWeight: '600' }}>
                            {idx + 1}. Khối <strong style={{ color: 'var(--accent)', textTransform: 'uppercase' }}>{sec.sectionType}</strong>: {sec.title}
                          </span>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                            <button 
                              onClick={() => moveSection(idx, 'up')}
                              disabled={idx === 0}
                              style={{ padding: '2px', opacity: idx === 0 ? 0.3 : 1 }}
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button 
                              onClick={() => moveSection(idx, 'down')}
                              disabled={idx === builderConfig.sections.length - 1}
                              style={{ padding: '2px', opacity: idx === builderConfig.sections.length - 1 ? 0.3 : 1 }}
                            >
                              <ArrowDown size={14} />
                            </button>
                            <button 
                              onClick={(e) => deleteSection(sec.id, e)}
                              style={{ padding: '2px', color: '#ef4444', marginLeft: '4px' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {expandedSectionId === sec.id && (
                          <div className="section-builder-body">
                            <div className="form-group">
                              <label>Loại khối nội dung (Section Type)</label>
                              <select 
                                className="form-input"
                                value={sec.sectionType || ''}
                                onChange={(e) => handleSectionChange(sec.id, 'sectionType', e.target.value)}
                              >
                                <option value="text">Văn bản (Text/Intro)</option>
                                <option value="gallery">Thư viện ảnh (Gallery)</option>
                                <option value="video">Video</option>
                                <option value="stats">Thống kê (Stats)</option>
                              </select>
                            </div>

                            <div className="form-group">
                              <label>Tiêu đề khối</label>
                              <input 
                                type="text" 
                                className="form-input" 
                                value={sec.title || ''}
                                onChange={(e) => handleSectionChange(sec.id, 'title', e.target.value)}
                              />
                            </div>
                            
                            <div className="form-group">
                              <label>Phụ đề khối</label>
                              <input 
                                type="text" 
                                className="form-input" 
                                value={sec.subtitle || ''}
                                onChange={(e) => handleSectionChange(sec.id, 'subtitle', e.target.value)}
                              />
                            </div>

                            {/* Custom form edits depending on sectionType */}
                            {sec.sectionType === 'intro' && sec.parsedContent.paragraphs && (
                              <div className="form-group">
                                <label>Văn bản giới thiệu (Đoạn 1)</label>
                                <textarea 
                                  className="form-textarea" 
                                  rows="3"
                                  value={sec.parsedContent.paragraphs[0] || ''}
                                  onChange={(e) => {
                                    const paras = [...sec.parsedContent.paragraphs];
                                    paras[0] = e.target.value;
                                    handleParsedContentChange(sec.id, 'paragraphs', paras);
                                  }}
                                ></textarea>
                              </div>
                            )}

                            {sec.sectionType === 'intro' && sec.parsedContent.stats && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Các chỉ số thống kê:</label>
                                {sec.parsedContent.stats.slice(0, 2).map((st, sIdx) => (
                                  <div key={sIdx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <input 
                                      type="text" 
                                      className="form-input" 
                                      style={{ fontSize: '12px', padding: '6px' }}
                                      value={st.label || ''}
                                      onChange={(e) => handleParsedContentChange(sec.id, 'stats', e.target.value, sIdx, 'label')}
                                    />
                                    <input 
                                      type="text" 
                                      className="form-input" 
                                      style={{ fontSize: '12px', padding: '6px' }}
                                      value={st.value || ''}
                                      onChange={(e) => handleParsedContentChange(sec.id, 'stats', e.target.value, sIdx, 'value')}
                                    />
                                  </div>
                                ))}
                              </div>
                            )}

                            {sec.sectionType === 'activities' && sec.parsedContent.items && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Biên tập thẻ hoạt động 1:</label>
                                <input 
                                  type="text" 
                                  className="form-input" 
                                  style={{ fontSize: '12px' }}
                                  value={sec.parsedContent.items[0]?.title || ''}
                                  onChange={(e) => handleParsedContentChange(sec.id, 'items', e.target.value, 0, 'title')}
                                />
                                <textarea 
                                  className="form-textarea" 
                                  rows="2"
                                  style={{ fontSize: '12px' }}
                                  value={sec.parsedContent.items[0]?.description || ''}
                                  onChange={(e) => handleParsedContentChange(sec.id, 'items', e.target.value, 0, 'description')}
                                ></textarea>
                              </div>
                            )}

                            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                              💡 Nội dung thô được serialize tự động sang JSONB trong Postgres.
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    <button 
                      onClick={addSection}
                      className="action-button primary" 
                      style={{ marginTop: '12px', justifyContent: 'center' }}
                    >
                      <Plus size={16} /> Thêm Khối Nội Dung Mới
                    </button>
                  </div>

                  {/* 6. Save Configuration Buttons */}
                  <div className="builder-action-bar">
                    <button 
                      onClick={handleSaveConfig} 
                      disabled={builderLoading}
                      className="btn btn-primary" 
                      style={{ flex: 1, justifyContent: 'center' }}
                    >
                      <Save size={16} />
                      {builderLoading ? 'Đang cập nhật...' : 'Lưu Thay Đổi (DB)'}
                    </button>
                  </div>
                </div>

                {/* Instant Real-Time Preview Rendering (Right Panel) */}
                <div className="builder-preview-iframe">
                  
                  {/* Floating badge for Preview indicator */}
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    zIndex: 99,
                    background: '#10b981',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 4px 10px rgba(16, 185, 129, 0.4)'
                  }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'white', animation: 'pulse 1s infinite' }}></div>
                    Live Preview (Thời gian thực)
                  </div>

                  {/* Renders the interactive mockup page based on builderConfig */}
                  <div 
                    className={`theme-wrapper theme-${builderConfig.themeId || 'ocean-breeze'}`}
                    style={{
                      height: '100%',
                      overflowY: 'auto',
                      paddingBottom: '40px',
                      color: '#0f172a',
                      background: builderConfig.themeId === 'ocean-breeze' ? '#f0f9ff' : builderConfig.themeId === 'heritage-gold' ? '#fdfcfa' : '#f4f6f5',
                      ...(builderConfig.customPrimaryColor ? { '--primary': builderConfig.customPrimaryColor } : {}),
                      ...(builderConfig.customSecondaryColor ? { '--secondary': builderConfig.customSecondaryColor } : {}),
                      ...(builderConfig.customFontFamily ? { fontFamily: `'${builderConfig.customFontFamily}', sans-serif` } : {})
                    }}
                  >
                    {/* Mock Hero Area */}
                    <div 
                      style={{ 
                        height: '240px', 
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('${builderConfig.heroImageUrl || 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80'}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                        padding: '20px',
                        textAlign: 'center'
                      }}
                    >
                      <h2 style={{ fontSize: '28px', fontWeight: '800' }}>{builderConfig.heroTitle || 'Chưa đặt tiêu đề'}</h2>
                      <p style={{ fontSize: '13px', opacity: 0.9, marginTop: '8px' }}>{builderConfig.heroSubtitle || 'Chưa đặt phụ đề'}</p>
                    </div>

                    {/* Mock Sections */}
                    {builderConfig.sections.map((sec, sIdx) => (
                      <div 
                        key={sIdx} 
                        style={{ 
                          padding: '30px 24px', 
                          borderBottom: '1px dashed rgba(0,0,0,0.08)',
                          background: sIdx % 2 === 0 ? 'rgba(0,0,0,0.01)' : 'transparent'
                        }}
                      >
                        <h4 style={{ 
                          fontSize: '18px', 
                          fontWeight: '800', 
                          color: builderConfig.themeId === 'ocean-breeze' ? '#0284c7' : builderConfig.themeId === 'heritage-gold' ? '#991b1b' : '#15803d',
                          marginBottom: '4px' 
                        }}>
                          {sec.title || 'Tiêu đề khối'}
                        </h4>
                        {sec.subtitle && (
                          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            {sec.subtitle}
                          </p>
                        )}

                        {/* Rendering simulated compact mock preview inside dashboard */}
                        {sec.sectionType === 'intro' && (
                          <div>
                            <p style={{ fontSize: '13px', color: '#334155', lineHeight: '1.6' }}>
                              {sec.parsedContent.paragraphs ? sec.parsedContent.paragraphs[0] : 'Không có văn bản giới thiệu.'}
                            </p>
                            
                            {sec.parsedContent.stats && (
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginTop: '16px' }}>
                                {sec.parsedContent.stats.slice(0, 4).map((st, stIdx) => (
                                  <div key={stIdx} style={{ background: 'white', padding: '8px 12px', borderRadius: '6px', textAlign: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                                    <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary)' }}>{st.value}</div>
                                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{st.label}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {sec.sectionType === 'activities' && sec.parsedContent.items && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {sec.parsedContent.items.map((act, actIdx) => (
                              <div key={actIdx} style={{ background: 'white', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--primary)', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                                <h5 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>{act.title}</h5>
                                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{act.description}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {sec.sectionType === 'gallery' && sec.parsedContent.images && (
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                            {sec.parsedContent.images.slice(0, 3).map((img, imgIdx) => (
                              <div key={imgIdx} style={{ height: '70px', borderRadius: '4px', overflow: 'hidden' }}>
                                <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                            ))}
                          </div>
                        )}

                        {sec.sectionType === 'cta' && (
                          <div style={{ 
                            background: 'var(--primary)', 
                            color: 'white', 
                            borderRadius: '8px', 
                            padding: '20px', 
                            textAlign: 'center',
                            marginTop: '10px'
                          }}>
                            <h5 style={{ fontSize: '15px', fontWeight: '800' }}>{sec.title}</h5>
                            <p style={{ fontSize: '11px', opacity: 0.9, marginTop: '4px', marginBottom: '12px' }}>{sec.subtitle}</p>
                            <button style={{ background: 'white', color: 'var(--primary)', padding: '6px 16px', fontSize: '12px', fontWeight: '700', borderRadius: '20px' }}>
                              {sec.parsedContent.buttonText || 'Đăng ký'}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : null}
          </div>
        )}

      </main>
    </div>
  );
};
