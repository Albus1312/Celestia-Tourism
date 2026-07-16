import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { Calendar, CheckCircle, Clock, XCircle, Search } from 'lucide-react';
import { showToast, confirmAction } from '../../utils/alertUtils';

const BookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await axiosClient.get('/booking/all');
      setBookings(data);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu Booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      // Vì status trong backend là Enum (0,1,2,3), ta cần map đúng giá trị số nguyên nếu cần
      await axiosClient.put(`/booking/${id}/status`, newStatus, {
        headers: { 'Content-Type': 'application/json' }
      });
      // Cập nhật state trực tiếp để UI nhanh
      setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      showToast('Có lỗi xảy ra khi cập nhật!', "error");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 0: // Pending
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" /> Chờ xử lý</span>;
      case 1: // Confirmed
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><CheckCircle className="w-3 h-3 mr-1" /> Đã xác nhận</span>;
      case 2: // Cancelled
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" /> Đã hủy</span>;
      case 3: // Completed
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Hoàn thành</span>;
      default:
        return <span>Unknown</span>;
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.tourPackage?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Calendar className="w-7 h-7 text-primary mr-2" />
            Quản lý Đặt Tour (Booking)
          </h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý và duyệt các yêu cầu đặt tour từ khách du lịch.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50/50">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary sm:text-sm transition-shadow"
              placeholder="Tìm theo tên Tour hoặc Email khách..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Mã / Khách hàng</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Gói Tour</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">Đang tải dữ liệu...</td></tr>
              ) : filteredBookings.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">Chưa có đơn đặt tour nào.</td></tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#BK-{b.id}</div>
                      <div className="text-sm text-gray-500">{b.user?.fullName || `User ID: ${b.userId}`}</div>
                      <div className="text-xs text-gray-400">{b.user?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">{b.tourPackage?.name || 'N/A'}</div>
                      <div className="text-xs text-gray-500">Ngày đi: {new Date(b.travelDate || b.bookingDate).toLocaleDateString('vi-VN')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {b.totalAmount ? b.totalAmount.toLocaleString('vi-VN') + ' đ' : 'Chưa tính'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(b.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <select 
                        value={b.status} 
                        onChange={(e) => handleUpdateStatus(b.id, parseInt(e.target.value))}
                        className="text-sm border-gray-300 rounded-lg focus:ring-primary focus:border-primary p-1.5"
                      >
                        <option value={0}>Chờ xử lý</option>
                        <option value={1}>Xác nhận</option>
                        <option value={2}>Đã hủy</option>
                        <option value={3}>Hoàn thành</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
