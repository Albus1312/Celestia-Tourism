import React, { useState } from 'react';
import { MapPin, Compass } from 'lucide-react';

export const VietnamMap = ({ activeRegion, onSelectRegion, activeProvince, onSelectProvince }) => {
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [hoveredPin, setHoveredPin] = useState(null);

  // Key coordinate pins of tourist hotspots
  const pins = [
    { id: 'sa-pa', name: 'Sa Pa', region: 'bac-bo', provinceId: 'lao-cai', x: 130, y: 80, desc: 'Thị trấn mây phủ Tây Bắc' },
    { id: 'vinh-ha-long', name: 'Vịnh Hạ Long', region: 'bac-bo', provinceId: 'quang-ninh', x: 210, y: 110, desc: 'Kỳ quan thiên nhiên thế giới' },
    { id: 'hanoi', name: 'Thành phố Hà Nội', region: 'bac-bo', provinceId: 'hanoi', x: 160, y: 115, desc: 'Thủ đô ngàn năm văn hiến' },
    { id: 'ninh-binh', name: 'Ninh Bình (Tràng An)', region: 'bac-bo', provinceId: 'ninh-binh', x: 165, y: 145, desc: 'Vịnh Hạ Long trên cạn' },
    { id: 'pho-co-hoi-an', name: 'Hội An', region: 'trung-bo', provinceId: 'quang-nam', x: 260, y: 280, desc: 'Đô thị cổ đèn lồng rực rỡ' },
    { id: 'da-lat', name: 'Đà Lạt', region: 'trung-bo', provinceId: 'lam-dong', x: 220, y: 440, desc: 'Thành phố hoa và ngàn thông' },
    { id: 'ho-chi-minh', name: 'TP. Hồ Chí Minh', region: 'nam-bo', provinceId: 'ho-chi-minh', x: 175, y: 490, desc: 'Hòn ngọc Viễn Đông sầm uất' },
    { id: 'phu-quoc', name: 'Đảo Phú Quốc', region: 'nam-bo', provinceId: 'kien-giang', x: 90, y: 520, desc: 'Đảo ngọc hoang sơ biển biếc' }
  ];

  const handleRegionClick = (regionId) => {
    if (activeRegion === regionId) {
      onSelectRegion(null); // Deselect
    } else {
      onSelectRegion(regionId);
    }
  };

  const handlePinClick = (pin) => {
    onSelectProvince(pin.provinceId);
  };

  return (
    <div className="map-container glass-panel">
      {/* Background grids for high-tech dashboard feel */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 0)',
        backgroundSize: '24px 24px',
        opacity: 0.8,
        pointerEvents: 'none'
      }}></div>

      {/* SVG Interactive Map */}
      <svg 
        viewBox="0 0 360 580" 
        className="map-svg"
      >
        <g id="vietnam-regions">
          {/* Bắc Bộ Group (North) */}
          <path
            d="M120,40 L160,20 L210,35 L240,65 L215,95 L225,120 L195,150 L165,160 L140,150 L115,100 Z"
            className={`map-path region-north ${activeRegion === 'bac-bo' ? 'active' : ''}`}
            onMouseEnter={() => setHoveredRegion('bac-bo')}
            onMouseLeave={() => setHoveredRegion(null)}
            onClick={() => handleRegionClick('bac-bo')}
          />

          {/* Trung Bộ Group (Central - slender curve) */}
          <path
            d="M195,150 L225,120 L230,135 L205,175 L220,200 L235,225 L270,270 L280,310 L250,370 L255,420 L230,460 L205,450 L215,410 L230,340 L210,300 L210,250 L190,200 Z"
            className={`map-path region-central ${activeRegion === 'trung-bo' ? 'active' : ''}`}
            onMouseEnter={() => setHoveredRegion('trung-bo')}
            onMouseLeave={() => setHoveredRegion(null)}
            onClick={() => handleRegionClick('trung-bo')}
          />

          {/* Nam Bộ Group (South - expanded bottom) */}
          <path
            d="M205,450 L230,460 L220,480 L195,510 L160,535 L125,540 L110,510 L130,475 L165,470 L190,460 Z"
            className={`map-path region-south ${activeRegion === 'nam-bo' ? 'active' : ''}`}
            onMouseEnter={() => setHoveredRegion('nam-bo')}
            onMouseLeave={() => setHoveredRegion(null)}
            onClick={() => handleRegionClick('nam-bo')}
          />

          {/* Archipelagos (Hoang Sa & Truong Sa) */}
          {/* Hoang Sa (Paracel Islands) */}
          <g transform="translate(300, 220)" style={{ cursor: 'pointer' }} onClick={() => handleRegionClick('trung-bo')}>
            <circle cx="0" cy="0" r="4" fill="#d97706" opacity="0.8" />
            <circle cx="10" cy="-5" r="3" fill="#d97706" opacity="0.8" />
            <circle cx="15" cy="10" r="4" fill="#d97706" opacity="0.8" />
            <text x="25" y="5" fill="#64748b" fontSize="8" fontWeight="600">QĐ. Hoàng Sa</text>
          </g>

          {/* Truong Sa (Spratly Islands) */}
          <g transform="translate(260, 420)" style={{ cursor: 'pointer' }} onClick={() => handleRegionClick('nam-bo')}>
            <circle cx="0" cy="0" r="3" fill="#059669" opacity="0.8" />
            <circle cx="20" cy="15" r="4" fill="#059669" opacity="0.8" />
            <circle cx="-10" cy="30" r="3" fill="#059669" opacity="0.8" />
            <circle cx="5" cy="45" r="4" fill="#059669" opacity="0.8" />
            <text x="15" y="35" fill="#64748b" fontSize="8" fontWeight="600">QĐ. Trường Sa</text>
          </g>
        </g>

        {/* Tourist Destination Glow Pins */}
        <g id="destination-pins">
          {pins.map((pin) => (
            <g 
              key={pin.id} 
              transform={`translate(${pin.x}, ${pin.y})`}
              onClick={() => handlePinClick(pin)}
              onMouseEnter={() => setHoveredPin(pin)}
              onMouseLeave={() => setHoveredPin(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Blinking ring effect */}
              <circle cx="0" cy="0" r="10" fill="none" stroke="#ef4444" strokeWidth="1">
                <animate attributeName="r" values="5;14" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0" dur="2s" repeatCount="indefinite" />
              </circle>
              {/* Inner glowing dot */}
              <circle cx="0" cy="0" r="4.5" className="map-pin-dot" />
            </g>
          ))}
        </g>
      </svg>

      {/* Floating Hover Card Info overlay */}
      {(hoveredPin || hoveredRegion) && (
        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: '24px',
          right: '24px',
          background: 'rgba(2, 4, 12, 0.9)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          animation: 'fadeIn 0.2s ease-out',
          zIndex: 10
        }}>
          {hoveredPin ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontWeight: '700', fontSize: '15px', marginBottom: '2px' }}>
                <MapPin size={14} />
                {hoveredPin.name}
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>{hoveredPin.desc}</div>
              <div style={{ fontSize: '10px', color: '#64748b', marginTop: '6px', fontStyle: 'italic' }}>Nhấp để lọc địa điểm này</div>
            </div>
          ) : hoveredRegion ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#3b82f6', fontWeight: '700', fontSize: '15px', marginBottom: '2px' }}>
                <Compass size={14} />
                {hoveredRegion === 'bac-bo' ? 'Vùng Bắc Bộ' : hoveredRegion === 'trung-bo' ? 'Vùng Trung Bộ' : 'Vùng Nam Bộ'}
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                {hoveredRegion === 'bac-bo' ? 'Khởi nguồn lịch sử, văn hóa ngàn năm và sương núi trùng điệp.' : 
                 hoveredRegion === 'trung-bo' ? 'Bờ biển ngập nắng vàng, di sản văn hóa cổ kính triều đại.' : 
                 'Đồng bằng sông trù phú, nhịp sống đô thị năng động phóng khoáng.'}
              </div>
              <div style={{ fontSize: '10px', color: '#64748b', marginTop: '6px', fontStyle: 'italic' }}>Nhấp chuột để lọc toàn bộ khu vực</div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
