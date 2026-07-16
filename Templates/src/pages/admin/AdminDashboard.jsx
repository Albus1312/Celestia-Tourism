import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Users, Map, CreditCard, Activity, Compass, FileText, Building, MessageCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const COLORS = ['#14b8a6', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899'];

const TopListCard = ({ title, data, icon: Icon, color, bgColor }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
    <div className="flex items-center mb-6">
      <div className={`p-3 rounded-xl ${bgColor} mr-3`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <h2 className="text-lg font-bold text-gray-800">{title}</h2>
    </div>
    
    <div className="flex-1">
      {data.length > 0 ? (
        <ul className="space-y-4">
          {data.map((item, index) => (
            <li key={index} className="flex items-center justify-between">
              <div className="flex items-center overflow-hidden">
                <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${index < 3 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {index + 1}
                </span>
                <span className="text-gray-700 font-medium truncate" title={item.name}>{item.name}</span>
              </div>
              <span className="shrink-0 font-bold text-gray-900 ml-4 bg-gray-50 px-2 py-1 rounded text-sm">{item.value} lượt xem</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="h-full flex items-center justify-center text-gray-500 text-sm py-8">Chưa có dữ liệu</div>
      )}
    </div>
  </div>
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const isEditor = user?.role === 'Editor';
  const [metrics, setMetrics] = useState(null);
  
  const [topDestinations, setTopDestinations] = useState([]);
  const [topTours, setTopTours] = useState([]);
  const [topServices, setTopServices] = useState([]);
  const [topArticles, setTopArticles] = useState([]);
  
  const [chartViews, setChartViews] = useState([]);
  const [timeFilter, setTimeFilter] = useState('6months');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [timeFilter]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await axiosClient.get(`/analytics/dashboard?timeFilter=${timeFilter}`);
      setMetrics(data.metrics);
      setChartViews(data.chartViews || []);
      
      setTopDestinations(data.topDestinations || []);
      setTopTours(data.topTours || []);
      setTopServices(data.topServices || []);
      setTopArticles(data.topArticles || []);

    } catch (error) {
      console.error('Lỗi khi tải dữ liệu Dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !metrics) return <div className="p-8 text-center text-gray-500">Đang tải biểu đồ...</div>;
  if (!metrics) return <div className="p-8 text-center text-red-500">Lỗi tải dữ liệu</div>;



  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bảng Điều Khiển (Dashboard)</h1>
        <p className="text-sm text-gray-500 mt-1">Tổng quan về hiệu suất hoạt động của hệ thống Celestia.</p>
        <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
          Dữ liệu thống kê chung toàn hệ thống.
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="flex items-center mb-2">
            <Users className="w-5 h-5 text-primary mr-2" />
            <p className="text-sm font-medium text-gray-500">Tổng Người dùng</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.totalUsers}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="flex items-center mb-2">
            <Compass className="w-5 h-5 text-orange-500 mr-2" />
            <p className="text-sm font-medium text-gray-500">Tổng Gói Tour</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.totalTours}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="flex items-center mb-2">
            <Map className="w-5 h-5 text-secondary mr-2" />
            <p className="text-sm font-medium text-gray-500">Tổng Địa điểm</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.totalDestinations}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="flex items-center mb-2">
            <Building className="w-5 h-5 text-indigo-500 mr-2" />
            <p className="text-sm font-medium text-gray-500">Tổng Dịch Vụ</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.totalServices}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="flex items-center mb-2">
            <FileText className="w-5 h-5 text-green-500 mr-2" />
            <p className="text-sm font-medium text-gray-500">Bài viết eMagazine</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.totalArticles}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="flex items-center mb-2">
            <Activity className="w-5 h-5 text-purple-500 mr-2" />
            <p className="text-sm font-medium text-gray-500">Lượt truy cập</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.totalPageViews}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Bar Chart Full Width (Monthly Views) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800">Biểu đồ Lượt xem Toàn Hệ thống</h2>
            <select 
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="mt-2 sm:mt-0 text-sm border border-gray-300 rounded-lg focus:ring-primary focus:border-primary px-3 py-1.5"
            >
              <option value="7days">7 ngày qua</option>
              <option value="30days">30 ngày qua</option>
              <option value="6months">6 tháng qua</option>
            </select>
          </div>
          
          <div className="h-72">
            {loading ? (
              <div className="h-full flex items-center justify-center text-gray-400">Đang tải...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartViews}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#f3f4f6'}} />
                  <Bar dataKey="views" name="Lượt xem (PageViews)" fill="#14b8a6" radius={[4, 4, 0, 0]} maxBarSize={60} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Hot Metrics Cards */}
        <TopListCard title="Top Địa điểm Hot nhất" data={topDestinations} icon={Map} color="text-secondary" bgColor="bg-amber-50" />
        <TopListCard title="Top Tour Hot nhất" data={topTours} icon={Compass} color="text-orange-500" bgColor="bg-orange-50" />
        <TopListCard title="Top Dịch vụ Hot nhất" data={topServices} icon={Building} color="text-indigo-500" bgColor="bg-indigo-50" />
        <TopListCard title="Top Bài viết eMagazine Hot nhất" data={topArticles} icon={FileText} color="text-green-500" bgColor="bg-green-50" />

      </div>
    </div>
  );
};

export default AdminDashboard;
