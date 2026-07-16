import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../contexts/AuthContext';
import { Mountain, Image as ImageIcon, Send, MessageCircle, Heart, Share2, MapPin, Users, Calendar, Loader2, X, Building, Star } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { showToast, confirmAction } from '../../utils/alertUtils';

const SocialFeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observer = useRef();
  
  const lastPostElementRef = React.useCallback(node => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);
  
  // New Post State
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [isLooking, setIsLooking] = useState(false);
  const [travelDate, setTravelDate] = useState('');
  const [mediaUrl, setMediaUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  // Comments State
  const [expandedComments, setExpandedComments] = useState({});
  const [postComments, setPostComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [loadingComments, setLoadingComments] = useState({});
  
  // Filter state
  const [filterMode, setFilterMode] = useState('all'); // 'all' or 'companion'
  
  // Promotional data
  const [promotedTours, setPromotedTours] = useState([]);
  const [promotedServices, setPromotedServices] = useState([]);

  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    fetchPromotions();
  }, []);

  useEffect(() => {
    fetchFeed(page);
  }, [page]);

  const fetchPromotions = async () => {
    try {
      const [tourRes, serviceRes] = await Promise.all([
        axiosClient.get('/booking/tours'),
        axiosClient.get('/localservices')
      ]);
      setPromotedTours(tourRes.filter(t => !t.isDeleted).slice(0, 2));
      setPromotedServices(serviceRes.filter(s => !s.isDeleted).slice(0, 3));
    } catch (error) {
      console.error('Lỗi tải quảng cáo:', error);
    }
  };

  const fetchFeed = async (pageNumber = 1) => {
    try {
      if (pageNumber === 1) setLoading(true);
      else setLoadingMore(true);
      
      const data = await axiosClient.get(`/social/feed?page=${pageNumber}&pageSize=5`);
      
      setPosts(prevPosts => {
        if (pageNumber === 1) return data.posts || data;
        
        // Tránh bị trùng lặp bài viết nếu backend trả về chậm
        const newPosts = data.posts || data;
        const existingIds = new Set(prevPosts.map(p => p.id));
        const filteredNew = newPosts.filter(p => !existingIds.has(p.id));
        
        return [...prevPosts, ...filteredNew];
      });
      
      if (data.hasMore !== undefined) {
         setHasMore(data.hasMore);
      } else {
         setHasMore(false);
      }
    } catch (error) {
      console.error('Lỗi khi tải bảng tin:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);
      const res = await axiosClient.post('/uploads/user', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMediaUrl(res.url);
    } catch (error) {
      console.error('Lỗi upload ảnh:', error);
      showToast('Không thể tải ảnh lên. Kích thước file có thể quá lớn hoặc định dạng không được hỗ trợ.', "error");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast("Vui lòng đăng nhập để đăng bài!", "error");
      return;
    }
    if (!newPostContent.trim() && !mediaUrl) return;

    try {
      setIsPosting(true);
      await axiosClient.post('/social/post', {
        content: newPostContent.trim() ? newPostContent.trim() : " ",
        mediaUrl: mediaUrl,
        isLookingForCompanion: isLooking,
        travelDate: isLooking && travelDate ? travelDate : null
      });
      
      setNewPostContent('');
      setMediaUrl(null);
      setIsLooking(false);
      setTravelDate('');
      
      setPage(1);
      if (page === 1) fetchFeed(1);
      showToast("Đăng bài thành công!", "success");
    } catch (error) {
      console.error('Lỗi khi đăng bài:', error);
      showToast('Có lỗi xảy ra, vui lòng thử lại.', "error");
    } finally {
      setIsPosting(false);
    }
  };

  const handleLike = async (postId) => {
    if (!user) {
      showToast("Vui lòng đăng nhập để thích bài viết!", "error");
      return;
    }
    try {
      const res = await axiosClient.post(`/social/post/${postId}/like`);
      // Update local state
      setPosts(posts.map(p => p.id === postId ? { ...p, likesCount: res.likesCount, isLikedByMe: res.isLikedByMe } : p));
    } catch (error) {
      console.error('Lỗi khi like:', error);
    }
  };

  const handleShare = (postId) => {
    const shareUrl = `${window.location.origin}${location.pathname}?post=${postId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      showToast("Đã sao chép liên kết bài viết vào khay nhớ tạm!", "success");
    });
  };

  const toggleComments = async (postId) => {
    const isExpanded = !expandedComments[postId];
    setExpandedComments({ ...expandedComments, [postId]: isExpanded });

    if (isExpanded && !postComments[postId]) {
      // Fetch comments
      try {
        setLoadingComments({ ...loadingComments, [postId]: true });
        const comments = await axiosClient.get(`/social/post/${postId}/comments`);
        setPostComments({ ...postComments, [postId]: comments });
      } catch (error) {
        console.error('Lỗi tải bình luận:', error);
      } finally {
        setLoadingComments({ ...loadingComments, [postId]: false });
      }
    }
  };

  const handlePostComment = async (postId) => {
    if (!user) {
      showToast("Vui lòng đăng nhập để bình luận!", "error");
      return;
    }
    
    const content = commentInputs[postId];
    if (!content || !content.trim()) return;

    try {
      await axiosClient.post(`/social/post/${postId}/comment`, { content });
      setCommentInputs({ ...commentInputs, [postId]: '' });
      
      // Refresh comments and post comment count
      const comments = await axiosClient.get(`/social/post/${postId}/comments`);
      setPostComments({ ...postComments, [postId]: comments });
      setPosts(posts.map(p => p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p));
    } catch (error) {
      console.error('Lỗi đăng bình luận:', error);
    }
  };

  const filteredPosts = filterMode === 'companion' 
    ? posts.filter(p => p.isLookingForCompanion) 
    : posts;

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 pt-16 pb-6 sticky top-0 z-40 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 text-center flex items-center justify-center">
          <Mountain className="w-8 h-8 text-primary mr-2" />
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Cộng Đồng Celestia</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 flex flex-col lg:flex-row gap-8 items-start justify-center">
        
        {/* Left Sidebar - Tours */}
        <div className="hidden lg:block w-72 shrink-0 sticky top-28">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center mb-4 pb-3 border-b border-gray-100">
              <Calendar className="w-5 h-5 text-primary mr-2" />
              <h3 className="font-bold text-gray-900">Tour Đề Xuất</h3>
            </div>
            <div className="space-y-5">
              {promotedTours.map(tour => (
                <Link key={tour.id} to={`/tours`} className="group block bg-gray-50/50 rounded-xl p-2 hover:bg-gray-50 transition-colors">
                  <div className="rounded-lg overflow-hidden mb-3 relative">
                    <img 
                      src={tour.imageUrl || tour.destination?.coverImageUrl || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=600'} 
                      alt={tour.name}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[11px] font-bold text-amber-600 shadow-sm">
                      {tour.duration}
                    </div>
                  </div>
                  <h4 className="font-bold text-[14px] leading-snug text-gray-900 group-hover:text-primary transition-colors line-clamp-2">{tour.name}</h4>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-primary font-bold text-sm">{tour.price?.toLocaleString()}đ</p>
                    <span className="text-[11px] font-medium text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-200 group-hover:border-primary/30 group-hover:text-primary transition-colors">Xem</span>
                  </div>
                </Link>
              ))}
            </div>
            <Link to="/tours" className="block text-center mt-5 text-sm text-primary font-medium hover:underline">
              Khám phá tất cả tour
            </Link>
          </div>
        </div>

        {/* Main Feed */}
        <div className="flex-1 max-w-2xl w-full mx-auto">
        {/* Khung Đăng Bài */}
        {user ? (
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold flex-shrink-0">
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex-1">
                <form onSubmit={handlePost}>
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder={`Bạn muốn chia sẻ điều gì về chuyến đi, ${user.fullName}?`}
                    className="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-primary/50 text-gray-700 resize-none h-24 mb-2"
                  />

                  {/* Media Preview */}
                  {mediaUrl && (
                    <div className="relative mb-3 rounded-xl overflow-hidden bg-gray-100 max-h-64 inline-block">
                      {mediaUrl.match(/\.(mp4|mov)$/i) ? (
                        <video src={mediaUrl} className="max-h-64 object-contain" controls />
                      ) : (
                        <img src={mediaUrl} alt="Preview" className="max-h-64 object-contain" />
                      )}
                      <button 
                        type="button" 
                        onClick={() => setMediaUrl(null)}
                        className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  {/* Option Tìm bạn đồng hành */}
                  <div className="bg-amber-50/50 rounded-xl p-3 border border-amber-100 mb-3 flex flex-col sm:flex-row sm:items-center gap-3">
                    <label className="flex items-center cursor-pointer text-sm font-medium text-amber-800">
                      <input 
                        type="checkbox" 
                        checked={isLooking}
                        onChange={(e) => setIsLooking(e.target.checked)}
                        className="mr-2 rounded text-primary focus:ring-primary w-4 h-4"
                      />
                      <Users className="w-4 h-4 mr-1" /> Tìm bạn đồng hành
                    </label>
                    
                    {isLooking && (
                      <div className="flex items-center text-sm border-l sm:border-amber-200 sm:pl-3">
                        <Calendar className="w-4 h-4 text-amber-600 mr-2" />
                        <input 
                          type="date"
                          value={travelDate}
                          onChange={(e) => setTravelDate(e.target.value)}
                          className="bg-transparent border-b border-amber-300 focus:border-amber-500 focus:ring-0 text-amber-900 px-1 py-0"
                          required={isLooking}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                    <div className="flex items-center">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        className="hidden" 
                        accept="image/*,video/mp4,video/quicktime"
                      />
                      <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="text-gray-500 hover:text-primary flex items-center transition-colors px-2 py-1 rounded-md hover:bg-gray-50 disabled:opacity-50"
                      >
                        {isUploading ? <Loader2 className="w-5 h-5 mr-1 animate-spin" /> : <ImageIcon className="w-5 h-5 mr-1" />} 
                        <span className="text-sm font-medium">{isUploading ? 'Đang tải...' : 'Ảnh/Video'}</span>
                      </button>
                    </div>
                    <button 
                      type="submit" 
                      disabled={isPosting || (!newPostContent.trim() && !mediaUrl)}
                      className="px-6 py-2 bg-primary text-white rounded-full font-medium flex items-center hover:bg-teal-700 transition-colors disabled:opacity-50 shadow-sm"
                    >
                      {isPosting ? 'Đang đăng...' : 'Đăng bài'}
                      <Send className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-teal-50 p-6 rounded-2xl shadow-sm border border-teal-100 mb-8 text-center">
            <h3 className="text-lg font-bold text-teal-900 mb-2">Tham gia Cộng đồng du lịch</h3>
            <p className="text-teal-700 mb-4 text-sm">Đăng nhập để chia sẻ hành trình, tìm kiếm bạn đồng hành cùng những người đam mê xê dịch.</p>
            <Link to="/login" className="inline-block px-6 py-2 bg-primary text-white rounded-full font-medium hover:bg-teal-700 transition-colors shadow-sm">Đăng nhập ngay</Link>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6">
          <button 
            onClick={() => setFilterMode('all')}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${filterMode === 'all' ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            Tất cả bài viết
          </button>
          <button 
            onClick={() => setFilterMode('companion')}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors flex items-center ${filterMode === 'companion' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200'}`}
          >
            <Users className="w-4 h-4 mr-2" /> Tìm bạn đồng hành
          </button>
        </div>

        {/* Feed */}
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Mountain className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>{filterMode === 'companion' ? 'Chưa có ai tìm bạn đồng hành lúc này.' : 'Chưa có bài viết nào.'}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map(post => (
              <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-5 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img src={post.userAvatar} alt="avatar" className="w-12 h-12 rounded-full object-cover border border-gray-100 shadow-sm" />
                    <div>
                      <h4 className="font-bold text-gray-900 text-[15px]">{post.userName}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{new Date(post.createdAt).toLocaleString('vi-VN')}</p>
                    </div>
                  </div>
                  
                  {/* Companion Badge at Top Right */}
                  {post.isLookingForCompanion && (
                    <div className="flex flex-col items-end">
                      <div className="inline-flex items-center bg-gradient-to-r from-amber-100 to-orange-50 px-3 py-1.5 rounded-lg border border-amber-200 shadow-sm">
                        <Users className="w-3.5 h-3.5 text-amber-600 mr-1.5" />
                        <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">Tìm Bạn Đi Cùng</span>
                      </div>
                      {post.travelDate && (
                        <p className="text-[11px] text-amber-700/80 font-medium mt-1 mr-1">KH: {new Date(post.travelDate).toLocaleDateString('vi-VN')}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="px-5 pb-3">
                  <p className="text-gray-800 whitespace-pre-wrap text-[15px] leading-relaxed">{post.content}</p>
                </div>

                {post.mediaUrl && (
                  <div className="w-full bg-gray-100 border-y border-gray-100">
                    {post.mediaUrl.match(/\.(mp4|mov)$/i) ? (
                      <video src={post.mediaUrl} className="w-full max-h-[500px] object-contain" controls />
                    ) : (
                      <img src={post.mediaUrl} alt="Post media" className="w-full max-h-[500px] object-contain" />
                    )}
                  </div>
                )}

                {post.destinationName && (
                  <div className="mx-5 my-3 p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center cursor-pointer hover:bg-gray-100 transition-colors">
                    <MapPin className="w-5 h-5 text-secondary mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Đang ở / Nhắc đến</p>
                      <p className="text-sm font-bold text-gray-900">{post.destinationName}</p>
                    </div>
                  </div>
                )}

                {/* Like/Comment stats */}
                <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between text-gray-500 text-[13px]">
                  <div className="flex items-center">
                    <span className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center mr-1">
                      <Heart className={`w-3 h-3 ${post.likesCount > 0 ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                    </span>
                    <span>{post.likesCount}</span>
                  </div>
                  <span className="hover:underline cursor-pointer" onClick={() => toggleComments(post.id)}>
                    {post.commentsCount} bình luận
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="px-2 py-1.5 border-t border-gray-100 flex items-center gap-1 mx-2">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className="flex-1 flex items-center justify-center py-2 hover:bg-gray-50 rounded-lg transition-colors group"
                  >
                    <Heart className={`w-5 h-5 mr-2 transition-colors ${post.isLikedByMe ? 'text-red-500 fill-red-500' : 'text-gray-500 group-hover:text-red-500'}`} />
                    <span className={`font-medium text-sm transition-colors ${post.isLikedByMe ? 'text-red-500' : 'text-gray-600 group-hover:text-red-500'}`}>Thích</span>
                  </button>
                  <button 
                    onClick={() => toggleComments(post.id)}
                    className="flex-1 flex items-center justify-center py-2 hover:bg-gray-50 rounded-lg transition-colors group"
                  >
                    <MessageCircle className="w-5 h-5 mr-2 text-gray-500 group-hover:text-blue-500 transition-colors" />
                    <span className="font-medium text-sm text-gray-600 group-hover:text-blue-500 transition-colors">Bình luận</span>
                  </button>
                  <button 
                    onClick={() => handleShare(post.id)}
                    className="flex-1 flex items-center justify-center py-2 hover:bg-gray-50 rounded-lg transition-colors group"
                  >
                    <Share2 className="w-5 h-5 mr-2 text-gray-500 group-hover:text-green-500 transition-colors" />
                    <span className="font-medium text-sm text-gray-600 group-hover:text-green-500 transition-colors">Chia sẻ</span>
                  </button>
                </div>

                {/* Comments Section */}
                {expandedComments[post.id] && (
                  <div className="border-t border-gray-100 bg-gray-50/50 p-5">
                    {/* Comment List */}
                    <div className="space-y-4 mb-4">
                      {loadingComments[post.id] ? (
                        <div className="flex justify-center py-2"><Loader2 className="w-5 h-5 animate-spin text-gray-400" /></div>
                      ) : postComments[post.id]?.length === 0 ? (
                        <p className="text-center text-sm text-gray-500">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                      ) : (
                        postComments[post.id]?.map(c => (
                          <div key={c.id} className="flex gap-3">
                            <img src={c.userAvatar} alt="avatar" className="w-8 h-8 rounded-full border border-gray-200" />
                            <div className="flex-1">
                              <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-4 py-2.5 shadow-sm inline-block max-w-full">
                                <h5 className="font-bold text-[13px] text-gray-900">{c.userName}</h5>
                                <p className="text-[14px] text-gray-800 mt-0.5 whitespace-pre-wrap">{c.content}</p>
                              </div>
                              <p className="text-[11px] text-gray-400 mt-1 ml-2">{new Date(c.createdAt).toLocaleString('vi-VN')}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Comment Input */}
                    {user ? (
                      <div className="flex gap-3 items-start mt-4 pt-4 border-t border-gray-100">
                        <img src={`https://ui-avatars.com/api/?name=${user.fullName || 'U'}`} alt="avatar" className="w-8 h-8 rounded-full border border-gray-200" />
                        <div className="flex-1 relative">
                          <textarea 
                            value={commentInputs[post.id] || ''}
                            onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                            placeholder="Viết bình luận..."
                            className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-2.5 text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none pr-12 min-h-[44px]"
                            rows={1}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handlePostComment(post.id);
                              }
                            }}
                          />
                          <button 
                            onClick={() => handlePostComment(post.id)}
                            disabled={!commentInputs[post.id]?.trim()}
                            className="absolute right-2 bottom-2 w-8 h-8 flex items-center justify-center text-primary hover:bg-primary/10 rounded-full transition-colors disabled:opacity-30"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500 mb-2">Đăng nhập để tham gia bình luận</p>
                        <Link to="/login" className="text-primary font-medium hover:underline text-sm">Đăng nhập ngay</Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            
            {loadingMore && (
              <div className="flex justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            )}
            
            <div ref={lastPostElementRef} className="h-4" />
          </div>
        )}
        </div>

        {/* Right Sidebar - Services */}
        <div className="hidden xl:block w-72 shrink-0 sticky top-28">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center mb-4 pb-3 border-b border-gray-100">
              <Building className="w-5 h-5 text-secondary mr-2" />
              <h3 className="font-bold text-gray-900">Dịch Vụ Tiện Ích</h3>
            </div>
            <div className="space-y-4">
              {promotedServices.map(service => (
                <Link key={service.id} to={`/services`} className="group flex gap-3 items-center p-2 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                    <img 
                      src={service.imageUrl || 'https://images.unsplash.com/photo-1542314831-c6a4d14b8fc4?q=80&w=400'} 
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="inline-block text-[10px] uppercase font-bold text-secondary bg-secondary/10 px-1.5 py-0.5 rounded mb-1">{service.serviceType}</span>
                    <h4 className="font-bold text-[13px] text-gray-900 group-hover:text-secondary transition-colors truncate">{service.name}</h4>
                    <p className="text-gray-900 font-bold text-sm mt-0.5">{service.price?.toLocaleString()}đ</p>
                  </div>
                </Link>
              ))}
            </div>
            <Link to="/services" className="block text-center mt-5 text-sm text-secondary font-medium hover:underline">
              Khám phá thêm dịch vụ
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SocialFeedPage;
