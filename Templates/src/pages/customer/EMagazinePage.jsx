import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Search } from 'lucide-react';

const EMagazinePage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await axiosClient.get('/articles');
        setArticles(data);
      } catch (error) {
        console.error('Lỗi khi tải danh sách bài viết:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredArticles = articles.filter(a => 
    a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isSearchActive = searchTerm.trim() !== '';

  // Pagination Logic
  let currentArticles = [];
  let totalPages = 1;

  if (isSearchActive) {
    const itemsPerPage = 6;
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    currentArticles = filteredArticles.slice(indexOfFirst, indexOfLast);
    totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  } else {
    // Custom pagination: Page 1 has 7 items (1 featured + 6 grid), Page 2+ has 6 items
    const indexOfFirst = currentPage === 1 ? 0 : 7 + (currentPage - 2) * 6;
    const indexOfLast = currentPage === 1 ? 7 : indexOfFirst + 6;
    currentArticles = filteredArticles.slice(indexOfFirst, indexOfLast);
    totalPages = 1 + Math.ceil(Math.max(0, filteredArticles.length - 7) / 6);
  }

  // Bài nổi bật (Bài đầu tiên)
  const featuredArticle = (!isSearchActive && currentPage === 1 && currentArticles.length > 0) ? currentArticles[0] : null;
  // Các bài còn lại
  const otherArticles = featuredArticle ? currentArticles.slice(1) : currentArticles;

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      
      {/* Hero Section eMagazine */}
      <div className="bg-white pt-24 pb-12 border-b border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-4">
            Celestia <span className="text-primary italic">eMagazine</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light">
            Tuyển tập những câu chuyện truyền cảm hứng, góc nhìn văn hóa và cẩm nang du lịch độc quyền.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto px-4 mt-8 max-w-2xl relative z-10">
        <div className="relative shadow-xl rounded-full">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
          <input 
            type="text" 
            placeholder="Tìm kiếm bài viết, chủ đề, địa danh..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 rounded-full border-2 border-white focus:outline-none focus:border-primary transition-all text-gray-700 bg-white font-medium text-lg"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-lg">
            Không tìm thấy bài viết nào phù hợp với tìm kiếm của bạn.
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {featuredArticle && (
              <div className="mb-20 group">
                <Link to={`/emagazine/${featuredArticle.slug}`} className="block">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[21/9] bg-gray-900">
                    <img 
                      src={featuredArticle.thumbnailUrl} 
                      onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1920'}
                      alt={featuredArticle.title} 
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-8 md:p-16 w-full md:w-3/4">
                      <div className="inline-block px-4 py-1 bg-primary text-white text-sm font-bold tracking-wider uppercase rounded-full mb-6">
                        Tiêu điểm
                      </div>
                      <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight group-hover:text-primary transition-colors">
                        {featuredArticle.title}
                      </h2>
                      <p className="text-gray-200 text-lg md:text-xl line-clamp-2 md:line-clamp-3 opacity-90 font-light">
                        {featuredArticle.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Other Articles Grid */}
            {otherArticles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {otherArticles.map((article) => (
                  <Link key={article.id} to={`/emagazine/${article.slug}`} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img 
                        src={article.thumbnailUrl} 
                        onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=600'}
                        alt={article.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-8 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-primary transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 line-clamp-3 leading-relaxed">
                          {article.excerpt}
                        </p>
                      </div>
                      <div className="mt-6 flex items-center text-primary font-semibold text-sm uppercase tracking-wider">
                        Đọc tiếp
                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-3 mt-16">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-5 py-2.5 rounded-xl transition-all font-medium flex items-center ${
                    currentPage === 1 ? 'text-gray-400 cursor-not-allowed bg-gray-100' : 'text-primary hover:bg-primary hover:text-white bg-white border border-primary/20 shadow-sm'
                  }`}
                >
                  Trước
                </button>
                
                <div className="flex space-x-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => paginate(i + 1)}
                      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all font-bold text-lg ${
                        currentPage === i + 1 
                          ? 'bg-primary text-white shadow-md transform scale-105' 
                          : 'text-gray-600 hover:bg-gray-100 bg-white border border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-5 py-2.5 rounded-xl transition-all font-medium flex items-center ${
                    currentPage === totalPages ? 'text-gray-400 cursor-not-allowed bg-gray-100' : 'text-primary hover:bg-primary hover:text-white bg-white border border-primary/20 shadow-sm'
                  }`}
                >
                  Sau
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default EMagazinePage;
