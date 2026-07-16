import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../contexts/AuthContext';
import { MapPin, ArrowRight, Mountain, Navigation, Compass, BookOpen, Calendar, Building, Star } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const HomePage = () => {
  const { user } = useAuth();
  
  const [destinations, setDestinations] = useState([]);
  const [articles, setArticles] = useState([]);
  const [tours, setTours] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [destRes, artRes, tourRes, serviceRes] = await Promise.all([
        axiosClient.get('/destinations'),
        axiosClient.get('/articles'),
        axiosClient.get('/booking/tours'),
        axiosClient.get('/localservices')
      ]);

      setDestinations(destRes.filter(d => d.isActive).slice(0, 3));
      setArticles(artRes.slice(0, 3));
      setTours(tourRes.filter(t => !t.isDeleted).slice(0, 3));
      setServices(serviceRes.filter(s => !s.isDeleted).slice(0, 3));
    } catch (error) {
      console.error('Lỗi tải dữ liệu trang chủ:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      
      {/* Navbar Customer */}
      <Navbar />

      {/* Hero Section */}
      <div className="relative pt-16 pb-32 flex content-center items-center justify-center min-h-[75vh]">
        <div className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{ backgroundImage: "url('/images/hinh-anh-cac-loai-hinh-du-lich-3.jpg')" }}>
          <span className="w-full h-full absolute opacity-40 bg-black"></span>
        </div>
        <div className="container relative mx-auto px-4 mt-16 text-center z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg">
            Khám phá Vẻ đẹp <span className="text-secondary">Việt Nam</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-3xl mx-auto drop-shadow-md">
            Hành trình đánh thức mọi giác quan. Trải nghiệm những vùng đất hùng vĩ, nền văn hóa đậm đà và ẩm thực khó quên cùng Celestia.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <a href="#destinations" className="px-8 py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-teal-600 transition-colors shadow-lg flex items-center">
              Khám phá ngay <Navigation className="ml-2 w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-20">Đang tải dữ liệu...</div>
      ) : (
        <>
          {/* Destinations Grid (Top 3) */}
          <section id="destinations" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16 flex flex-col items-center">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
                  <Compass className="w-8 h-8 text-primary mr-3" /> 
                  Top Địa Điểm Hot
                </h2>
                <div className="w-24 h-1 bg-secondary mt-4 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {destinations.map((dest) => (
                  <Link key={dest.id} to={`/destination/${dest.id}`} className="group relative bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 flex flex-col">
                    <div className="h-56 w-full relative overflow-hidden bg-gray-200 flex-shrink-0">
                      <img 
                        src={dest.coverImageUrl || 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=1000&auto=format&fit=crop'} 
                        alt={dest.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
                        {dest.category?.name || 'Du lịch'}
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center text-gray-500 text-sm mb-2">
                        <MapPin className="w-4 h-4 mr-1 text-secondary" />
                        {dest.province?.name || 'Việt Nam'}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">{dest.name}</h3>
                      <p className="mt-3 text-gray-600 line-clamp-2 text-sm flex-1">
                        {dest.description || 'Khám phá vẻ đẹp tiềm ẩn cùng những trải nghiệm không thể nào quên.'}
                      </p>
                      <div className="mt-6 flex items-center text-primary font-medium text-sm">
                        Xem chi tiết <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* eMagazine Articles Grid (Top 3) */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16 flex flex-col items-center">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-primary mr-3" /> 
                  Bài Viết Nổi Bật
                </h2>
                <div className="w-24 h-1 bg-secondary mt-4 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {articles.map((article) => (
                  <Link key={article.id} to={`/emagazine/${article.slug}`} className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1">
                    <div className="h-56 relative overflow-hidden flex-shrink-0">
                      <img 
                        src={article.thumbnailUrl || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000'} 
                        alt={article.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold rounded-full mb-2">
                          {article.category || 'Du ký'}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                        {article.excerpt || 'Đọc bài viết đầy đủ trên Celestia eMagazine...'}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 mt-auto pt-4 border-t border-gray-50">
                        <span>{new Date(article.publishedAt || article.createdAt).toLocaleDateString('vi-VN')}</span>
                        <div className="flex items-center text-primary font-medium">
                          Đọc tiếp <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Tours Grid (Top 3) */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16 flex flex-col items-center">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-primary mr-3" /> 
                  Tour Đặt Nhiều Nhất
                </h2>
                <div className="w-24 h-1 bg-secondary mt-4 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {tours.map((tour) => (
                  <Link key={tour.id} to="/tours" className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col transform hover:-translate-y-1">
                    <div className="relative h-56 flex-shrink-0">
                      <img 
                        src={tour.imageUrl || tour.destination?.coverImageUrl || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1000'} 
                        alt={tour.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-amber-600 shadow-sm border border-amber-100">
                        {tour.duration}
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">{tour.name}</h3>
                      <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Giá từ</p>
                          <p className="text-xl font-bold text-primary">{tour.price?.toLocaleString()}đ</p>
                        </div>
                        <div className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium group-hover:bg-primary group-hover:text-white transition-colors text-sm flex items-center">
                          Đặt ngay
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Services Grid (Top 3) */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16 flex flex-col items-center">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
                  <Building className="w-8 h-8 text-primary mr-3" /> 
                  Dịch Vụ Nổi Bật
                </h2>
                <div className="w-24 h-1 bg-secondary mt-4 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {services.map((service) => (
                  <Link key={service.id} to="/services" className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col transform hover:-translate-y-1">
                    <div className="relative h-56 flex-shrink-0">
                      <img 
                        src={service.imageUrl || 'https://images.unsplash.com/photo-1542314831-c6a4d14b8fc4?q=80&w=1000'} 
                        alt={service.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm border border-primary/20">
                        {service.serviceType}
                      </div>
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center shadow-sm">
                        <Star className="w-4 h-4 text-amber-500 fill-current" />
                        <span className="ml-1 text-sm font-bold text-gray-900">4.8</span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center text-gray-500 text-sm mb-2">
                        <MapPin className="w-4 h-4 mr-1 text-secondary" />
                        {service.destination?.name || 'Việt Nam'}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-1">{service.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
                        {service.description || 'Trải nghiệm dịch vụ tuyệt vời tại điểm đến.'}
                      </p>
                      <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Giá từ</p>
                          <p className="text-xl font-bold text-primary">{service.price?.toLocaleString()}đ</p>
                        </div>
                        <div className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium group-hover:bg-primary group-hover:text-white transition-colors text-sm flex items-center">
                          Xem dịch vụ
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Footer */}
      {/* Fallback to simple footer if no Footer component */}
      <Footer />
    </div>
  );
};

export default HomePage;
