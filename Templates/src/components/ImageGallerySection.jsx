import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

const ImageGallerySection = ({ urls = [], title = "Ảnh nổi bật" }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  if (!urls || urls.length === 0) return null;

  const openLightbox = (index) => setSelectedImageIndex(index);
  const closeLightbox = () => setSelectedImageIndex(null);
  
  const nextImage = (e) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev === urls.length - 1 ? 0 : prev + 1));
  };
  
  const prevImage = (e) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev === 0 ? urls.length - 1 : prev - 1));
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <ImageIcon className="w-6 h-6 text-primary mr-2" />
        {title}
      </h2>
      
      {/* Grid hiện thị tối đa 3 ảnh, nếu nhiều hơn thì ảnh thứ 3 có overlay +N */}
      <div className={`grid gap-4 ${urls.length === 1 ? 'grid-cols-1' : urls.length === 2 ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-3'}`}>
        {urls.slice(0, 3).map((url, index) => {
          const isLastVisible = index === 2 && urls.length > 3;
          const isFirstInThree = urls.length >= 3 && index === 0;

          return (
            <div 
              key={index}
              onClick={() => openLightbox(index)}
              className={`relative rounded-2xl overflow-hidden cursor-pointer group aspect-[4/3] ${isFirstInThree ? 'md:col-span-2 md:row-span-2 aspect-auto' : ''}`}
            >
              <img 
                src={url} 
                alt={`Gallery ${index}`} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=Lỗi+hiển+thị+ảnh'; }}
              />
              
              {/* Overlay hover */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">Xem chi tiết</span>
              </div>

              {/* Overlay cho ảnh thứ 3 nếu có nhiều hơn 3 ảnh */}
              {isLastVisible && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-colors group-hover:bg-black/60">
                  <span className="text-white text-xl md:text-3xl font-bold">+{urls.length - 3}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md" onClick={closeLightbox}>
          <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12" onClick={e => e.stopPropagation()}>
            <button 
              onClick={closeLightbox}
              className="absolute top-6 right-6 z-50 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            
            <img 
              src={urls[selectedImageIndex]} 
              alt="Đang xem" 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
            
            {urls.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-colors backdrop-blur-sm"
                >
                  <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-colors backdrop-blur-sm"
                >
                  <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                </button>
              </>
            )}
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium">
              {selectedImageIndex + 1} / {urls.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallerySection;
