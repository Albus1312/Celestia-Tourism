import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

import { AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { showToast, confirmAction } from '../../utils/alertUtils';

const ArticleDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  
  // Pagination for comments
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5;

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await axiosClient.get(`/articles/slug/${slug}`);
        setArticle(data);
        // Fetch comments after article is loaded
        const commentsData = await axiosClient.get(`/articles/${data.id}/comments`);
        setComments(commentsData);

        // Log page view
        try {
          await axiosClient.post('/analytics/log-view', {
            articleId: data.id
          });
        } catch (err) {
          console.error('Lỗi khi log view:', err);
        }
      } catch (error) {
        console.error('Lỗi khi tải chi tiết bài viết:', error);
        if (error.response?.status === 404) {
          navigate('/emagazine');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug, navigate]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user || !article) return;

    try {
      setIsSubmittingComment(true);
      const res = await axiosClient.post(`/comments/article/${article.id}`, { content: newComment });
      setComments([res, ...comments]);
      setNewComment('');
      setCurrentPage(1); // Go back to first page to see the new comment
      showToast('Gửi bình luận thành công!', "success");
    } catch (error) {
      console.error('Lỗi khi gửi bình luận:', error);
      showToast('Không thể gửi bình luận. Vui lòng thử lại!', "error");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleReportComment = async (commentId) => {
    if (!user) {
      showToast('Vui lòng đăng nhập để báo cáo', "error");
      return;
    }
    if (!(await confirmAction('Báo cáo bình luận này?'))) return;
    try {
      await axiosClient.post(`/comments/${commentId}/report`);
      showToast('Đã gửi báo cáo', "success");
    } catch (error) {
      showToast('Có lỗi xảy ra', "error");
    }
  };

  // Get current comments for pagination
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);
  const totalPages = Math.ceil(comments.length / commentsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!article) return null;

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      {/* Article Hero */}
      <div className="relative h-[60vh] md:h-[80vh] w-full bg-gray-900">
        <img 
          src={article.thumbnailUrl} 
          onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1920'}
          alt={article.title} 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full px-4 pb-12 md:pb-24 pt-32">
          <div className="container mx-auto max-w-4xl">
            <Link to="/emagazine" className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors uppercase tracking-widest text-sm font-semibold">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Trở về eMagazine
            </Link>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6 text-shadow-sm">
              {article.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-800 font-light border-l-4 border-primary pl-6 py-2">
              {article.excerpt}
            </p>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          {/* Render HTML from ContentJson directly or parse it if it's JSON from PageBuilder */}
          <div 
            className="prose prose-lg prose-gray max-w-none break-words [&_*]:!whitespace-normal"
            dangerouslySetInnerHTML={{ 
              __html: (() => {
                try {
                  const parsed = JSON.parse(article.contentJson);
                  let initialContent = article.contentJson;
                  if (parsed.sections && Array.isArray(parsed.sections)) {
                    initialContent = parsed.sections.map(s => s.htmlRendered).join('');
                  }
                  
                  // Fix broken unsplash images by removing their container divs
                  initialContent = initialContent.replace(/<div[^>]*>[\s\S]*?(1559592413710-147fc5e744ec|1559098522-a5e2f785bc0b)[\s\S]*?<\/div>/g, '');
                  // Replace non-breaking spaces that cause horizontal scroll
                  initialContent = initialContent.replace(/&nbsp;/g, ' ');
                  
                  return initialContent;
                } catch (e) {
                  let html = article.contentJson;
                  html = html.replace(/<div[^>]*>[\s\S]*?(1559592413710-147fc5e744ec|1559098522-a5e2f785bc0b)[\s\S]*?<\/div>/g, '');
                  html = html.replace(/&nbsp;/g, ' ');
                  return html;
                }
              })()
            }}
          />

          {/* Related Destination Link */}
          {article.destination && (
            <div className="mt-16 pt-10 border-t border-gray-200">
              <div className="bg-gray-50 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Khám phá địa điểm trong bài viết</h3>
                <p className="text-gray-600 mb-6">Bạn đã sẵn sàng để tự mình trải nghiệm vẻ đẹp của {article.destination.name}?</p>
                <Link 
                  to={`/destination/${article.destination.id}`}
                  className="inline-block bg-primary text-white font-semibold px-8 py-3 rounded-full hover:bg-teal-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Xem chi tiết địa điểm
                </Link>
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="mt-16 pt-10 border-t border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Bình luận ({comments.length})</h3>
            
            {user ? (
              <form onSubmit={handleSubmitComment} className="mb-10">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold">
                    {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Viết bình luận của bạn..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none h-24 transition-all"
                      required
                    ></textarea>
                    <div className="mt-3 flex justify-end">
                      <button 
                        type="submit" 
                        disabled={isSubmittingComment || !newComment.trim()}
                        className="bg-primary hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                      >
                        {isSubmittingComment ? 'Đang gửi...' : 'Gửi bình luận'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="bg-gray-50 rounded-xl p-6 mb-10 text-center border border-gray-100">
                <p className="text-gray-600 mb-4">Vui lòng đăng nhập để tham gia thảo luận.</p>
                <Link to="/login" className="inline-block bg-white text-primary border border-primary px-6 py-2 rounded-full hover:bg-primary hover:text-white transition-colors font-medium">
                  Đăng nhập ngay
                </Link>
              </div>
            )}

            <div className="space-y-6">
              {currentComments.map((comment) => (
                <div key={comment.id} className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 text-gray-600 font-bold">
                    {comment.userName ? comment.userName[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="flex items-baseline justify-between mb-1">
                      <div className="flex items-baseline gap-3">
                        <h4 className="font-bold text-gray-900">{comment.userName}</h4>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString('vi-VN')} lúc {new Date(comment.createdAt).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      <button 
                        onClick={() => handleReportComment(comment.id)}
                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Báo cáo bình luận"
                      >
                        <AlertTriangle className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-gray-700 whitespace-pre-line">{comment.content}</p>
                  </div>
                </div>
              ))}
              
              {comments.length === 0 && !user && (
                <p className="text-center text-gray-500 italic">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-primary hover:bg-primary/10'
                  }`}
                >
                  Trước
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
                      currentPage === i + 1 
                        ? 'bg-primary text-white font-bold' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-primary hover:bg-primary/10'
                  }`}
                >
                  Sau
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ArticleDetailPage;
