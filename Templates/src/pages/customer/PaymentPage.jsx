import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Clock, AlertCircle } from 'lucide-react';

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes

  useEffect(() => {
    fetchQrCode();
  }, [bookingId]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft]);

  const fetchQrCode = async () => {
    try {
      const data = await axiosClient.get(`/payment/generate-qr/${bookingId}`);
      setQrData(data);
    } catch (err) {
      setError('Không thể tải mã QR thanh toán. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          
          <div className="bg-primary p-6 text-center text-white">
            <h2 className="text-2xl font-bold mb-2">Thanh Toán Đơn Hàng #{bookingId}</h2>
            <div className="flex items-center justify-center text-white/80 font-medium">
              <Clock className="w-4 h-4 mr-2" />
              Thời gian giữ chỗ: {formatTime(timeLeft)}
            </div>
          </div>

          <div className="p-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-gray-500 font-medium">Đang tạo mã VietQR...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Lỗi tải mã QR</h3>
                <p className="text-gray-500">{error}</p>
              </div>
            ) : qrData ? (
              <div className="flex flex-col items-center">
                <div className="w-64 h-64 border-4 border-primary rounded-xl overflow-hidden p-2 bg-white shadow-sm mb-6 flex justify-center items-center">
                  <img src={qrData.qrUrl} alt="VietQR" className="w-full h-full object-contain" />
                </div>
                
                <div className="w-full bg-gray-50 rounded-xl p-4 space-y-3 mb-8 border border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Chủ tài khoản:</span>
                    <span className="font-bold text-gray-900 text-sm text-right">{qrData.accountName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Số tài khoản:</span>
                    <span className="font-bold text-gray-900 text-sm">{qrData.accountNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Số tiền:</span>
                    <span className="font-bold text-secondary">{qrData.amount.toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-3 mt-3">
                    <span className="text-gray-500 text-sm">Nội dung CK:</span>
                    <span className="font-bold text-primary">{qrData.description}</span>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <p className="text-sm text-gray-500 mb-2">Mở ứng dụng ngân hàng và quét mã VietQR để thanh toán nhanh chóng.</p>
                  <div className="p-3 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-100">
                    <strong>Lưu ý quan trọng:</strong> Vui lòng nhập chính xác nội dung chuyển khoản là mã đơn hàng (Ví dụ: CELESTIA ORDER {bookingId}). 
                    <br/><br/>
                    Sau khi thanh toán thành công, vui lòng chờ Admin xác nhận. Hệ thống sẽ gửi Email thông báo và vé điện tử cho bạn ngay khi duyệt xong.
                  </div>
                </div>

                {/* Nút điều hướng */}
                <button
                  onClick={() => navigate('/itinerary')}
                  className="w-full flex justify-center items-center py-4 px-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-teal-700 transition-colors shadow-md"
                >
                  Về Lịch Trình Của Tôi
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentPage;
