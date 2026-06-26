import React, { useState, useEffect } from 'react';
import { X, Calendar, Users, CreditCard, CheckCircle, Loader2 } from 'lucide-react';
import { api, API_BASE_URL } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const TourBookingModal = ({ destination, onClose }) => {
  const { user } = useAuth();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Wizard steps: 1 = Select Tour, 2 = Checkout, 3 = Success
  const [step, setStep] = useState(1);
  const [selectedTour, setSelectedTour] = useState(null);
  
  const [formData, setFormData] = useState({
    travelDate: '',
    numberOfPeople: 1
  });
  const [submitting, setSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  useEffect(() => {
    fetchTours();
  }, [destination.id]);

  const fetchTours = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/tours/destination/${destination.id}`);
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

  const handleSelectTour = (tour) => {
    setSelectedTour(tour);
    setStep(2);
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        userId: user ? user.id : 0, // Fallback to 0 if not logged in, API will handle
        tourPackageId: selectedTour.id,
        travelDate: formData.travelDate || new Date().toISOString(),
        numberOfPeople: formData.numberOfPeople,
        totalAmount: selectedTour.price * formData.numberOfPeople
      };
      
      const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        const data = await res.json();
        setBookingId(data.bookingId);
        setStep(3);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <div style={{
        background: 'white', borderRadius: '16px', width: '100%', maxWidth: '600px',
        maxHeight: '90vh', overflowY: 'auto', position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'white', zIndex: 10 }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#0f172a' }}>
            {step === 1 ? 'Chọn Gói Tour' : step === 2 ? 'Thanh Toán & Xác Nhận' : 'Đặt Tour Thành Công'}
          </h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          
          {step === 1 && (
            <div>
              <p style={{ color: '#475569', marginBottom: '20px' }}>Hiện có {tours.length} gói tour dành cho điểm đến <strong>{destination.name}</strong>.</p>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}><Loader2 className="spin" size={32} /></div>
              ) : tours.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: '12px' }}>
                  <p style={{ color: '#94a3b8' }}>Chưa có gói tour nào được mở bán tại đây.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {tours.map(t => (
                    <div key={t.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' }} className="tour-card-hover">
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>{t.name}</h3>
                        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '12px' }}>{t.description || 'Chuyến đi tuyệt vời dành cho bạn.'}</p>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#0f172a', fontWeight: '600' }}>
                          <span>⏱ {t.durationDays} Ngày</span>
                          <span style={{ color: '#059669' }}>{t.price.toLocaleString('vi-VN')} VND</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleSelectTour(t)}
                        style={{ padding: '10px 20px', borderRadius: '8px', background: 'var(--primary)', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
                      >
                        Chọn Tour
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 2 && selectedTour && (
            <form onSubmit={handleSubmitBooking}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>{selectedTour.name}</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: '14px' }}>
                  <span>Đơn giá:</span>
                  <strong>{selectedTour.price.toLocaleString('vi-VN')} VND / người</strong>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '600', color: '#334155' }}>
                    <Calendar size={18} /> Ngày khởi hành
                  </label>
                  <input 
                    type="date" 
                    required 
                    value={formData.travelDate}
                    onChange={e => setFormData({...formData, travelDate: e.target.value})}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '600', color: '#334155' }}>
                    <Users size={18} /> Số lượng hành khách
                  </label>
                  <input 
                    type="number" 
                    min="1" max="50"
                    required 
                    value={formData.numberOfPeople}
                    onChange={e => setFormData({...formData, numberOfPeople: parseInt(e.target.value)})}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div style={{ borderTop: '2px dashed #e2e8f0', paddingTop: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#475569' }}>Tổng tiền:</span>
                <span style={{ fontSize: '24px', fontWeight: '800', color: '#059669' }}>
                  {(selectedTour.price * formData.numberOfPeople).toLocaleString('vi-VN')} VND
                </span>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setStep(1)} style={{ flex: 1, padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', fontWeight: '600', cursor: 'pointer' }}>
                  Quay Lại
                </button>
                <button type="submit" disabled={submitting} style={{ flex: 2, padding: '14px', borderRadius: '8px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                  {submitting ? <Loader2 className="spin" size={20} /> : <CreditCard size={20} />}
                  Thanh Toán Ngay
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '30px 10px' }}>
              <CheckCircle size={64} style={{ color: '#10b981', margin: '0 auto 20px auto' }} />
              <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>Đặt Tour Thành Công!</h3>
              <p style={{ color: '#475569', marginBottom: '24px', lineHeight: '1.6' }}>
                Mã đặt chỗ của bạn là <strong>#{bookingId || '10239'}</strong>.<br/>
                Chúng tôi đã gửi email xác nhận và chi tiết thanh toán cho bạn. Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi!
              </p>
              <button onClick={onClose} style={{ padding: '14px 32px', borderRadius: '30px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
                Đóng Cửa Sổ
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
