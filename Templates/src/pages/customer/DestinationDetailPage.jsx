import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { ArrowLeft, Loader2 } from 'lucide-react';
import ReviewSection from '../../components/ReviewSection';
import GalleryEnhancer from '../../components/GalleryEnhancer';
import FeaturedItemsSection from '../../components/FeaturedItemsSection';
import ImageGallerySection from '../../components/ImageGallerySection';

const DestinationDetailPage = () => {
  const { id } = useParams();
  const [config, setConfig] = useState(null);
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    fetchConfig();
    fetchDestination();
  }, [id]);

  const fetchDestination = async () => {
    try {
      const data = await axiosClient.get(`/destinations/${id}`);
      setDestination(data);
    } catch (error) {
      console.error('Lỗi khi tải thông tin địa điểm:', error);
    }
  };

  const fetchConfig = async () => {
    try {
      setLoading(true);
      setShowContent(false);
      setIsFadingOut(false);
      const data = await axiosClient.get(`/landingpage/destination/${id}`);
      setConfig(data);
      
      // Start fade out transition
      setTimeout(() => {
        setIsFadingOut(true);
        setTimeout(() => {
          setLoading(false);
          setShowContent(true);
        }, 500); // Wait for fade out to complete
      }, 300); // Fake a small delay so skeleton feels natural

      // Log page view
      try {
        await axiosClient.post('/analytics/log-view', {
          destinationId: parseInt(id)
        });
      } catch (err) {
        console.error('Lỗi khi log view:', err);
      }
    } catch (error) {
      console.error('Lỗi khi tải Landing Page:', error);
      setConfig(null);
      setLoading(false);
      setShowContent(true);
    }
  };

  // Màn hình Skeleton Loading mượt mà
  const renderSkeleton = () => (
    <div className={`fixed inset-0 z-[200] bg-white transition-opacity duration-500 ease-in-out ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="w-full h-full flex flex-col">
        {/* Skeleton Hero Banner */}
        <div className="w-full h-[60vh] bg-gray-100 animate-pulse flex items-center justify-center">
          <div className="text-gray-300">
            <Loader2 className="w-12 h-12 animate-spin opacity-50" />
          </div>
        </div>
        {/* Skeleton Content */}
        <div className="flex-1 p-10 max-w-6xl mx-auto w-full space-y-8 mt-12">
          <div className="h-12 bg-gray-100 rounded-lg w-1/3 animate-pulse"></div>
          <div className="space-y-4">
            <div className="h-5 bg-gray-100 rounded w-full animate-pulse"></div>
            <div className="h-5 bg-gray-100 rounded w-11/12 animate-pulse"></div>
            <div className="h-5 bg-gray-100 rounded w-4/5 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <div className="h-64 bg-gray-100 rounded-xl animate-pulse"></div>
            <div className="h-64 bg-gray-100 rounded-xl animate-pulse"></div>
            <div className="h-64 bg-gray-100 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );

  // Lấy HTML/CSS đã được render từ GrapesJS (Lưu trong section đầu tiên)
  const mainSection = config?.sections?.find(s => s.sectionType === 'MainContent');
  const customHtml = mainSection?.htmlRendered || '';
  const customCss = mainSection?.cssRendered || '';

  return (
    <div className="min-h-screen w-full relative bg-gray-50 overflow-x-hidden">
      {loading && renderSkeleton()}

      <div className={`w-full h-full transition-opacity duration-700 ease-in-out ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        {/* Nút quay lại (nổi) */}
        <div className="fixed top-4 left-4 z-[100]">
          <Link 
            to="/" 
            className="flex items-center justify-center w-10 h-10 bg-white/80 backdrop-blur-md rounded-full shadow-lg text-gray-700 hover:text-primary transition-all hover:scale-110 border border-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>

        {/* Tiêm CSS tùy chỉnh được xuất từ GrapesJS */}
        {customCss && (
          <style dangerouslySetInnerHTML={{ __html: customCss }} />
        )}

        {/* Nội dung Landing Page hoặc màn hình báo lỗi */}
        {(!config || !config.sections || config.sections.length === 0) ? (
          <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Chưa có dữ liệu</h2>
            <p className="text-gray-500 mb-8 max-w-md">
              Địa điểm này đang trong quá trình cập nhật nội dung. Vui lòng quay lại sau!
            </p>
            <Link to="/" className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-teal-700 transition-colors inline-flex items-center">
              <ArrowLeft className="w-5 h-5 mr-2" /> Về trang chủ
            </Link>
          </div>
        ) : (
          customHtml ? (
            <div className="w-full bg-white overflow-x-hidden">
              <div 
                className="grapesjs-content-wrapper w-full min-h-screen overflow-x-hidden"
                dangerouslySetInnerHTML={{ __html: customHtml }} 
              />
              
              <GalleryEnhancer htmlContentKey={customHtml} />
              
              <div className="bg-gray-50 pt-12 pb-12 border-t border-gray-200">
                {/* Fixed Image Gallery Section */}
                <div className="max-w-7xl mx-auto px-4 mb-12">
                  <ImageGallerySection urls={destination?.galleryUrls} title={`Ảnh nổi bật của ${destination?.name || 'địa điểm'}`} />
                </div>

                {/* Inject Featured Tours & Services right after visual content */}
                <FeaturedItemsSection destinationId={id} />

                {/* Inject Reviews and Comments Section */}
                <ReviewSection targetType="destination" targetId={id} />
              </div>
            </div>
          ) : (
            <div className="p-20 text-center text-gray-500 min-h-screen flex items-center justify-center">Nội dung trống.</div>
          )
        )}
      </div>
    </div>
  );
};

export default DestinationDetailPage;
