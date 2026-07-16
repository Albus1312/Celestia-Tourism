import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const GalleryEnhancer = ({ htmlContentKey }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // 1. Kích hoạt slider cho các gallery mẫu mới (nếu có)
    const galleryWrappers = document.querySelectorAll('.cj-gallery-wrapper');
    galleryWrappers.forEach(wrapper => {
      const container = wrapper.querySelector('.cj-gallery-container');
      const prevBtn = wrapper.querySelector('.cj-gallery-prev');
      const nextBtn = wrapper.querySelector('.cj-gallery-next');

      if (prevBtn && nextBtn && container) {
        const handlePrev = (e) => { e.preventDefault(); e.stopPropagation(); container.scrollBy({ left: -300, behavior: 'smooth' }); };
        const handleNext = (e) => { e.preventDefault(); e.stopPropagation(); container.scrollBy({ left: 300, behavior: 'smooth' }); };
        
        prevBtn.addEventListener('click', handlePrev);
        nextBtn.addEventListener('click', handleNext);
        
        // Lưu reference để dọn dẹp
        prevBtn._cjHandler = handlePrev;
        nextBtn._cjHandler = handleNext;
      }
    });

    // 2. Kích hoạt Lightbox cho TẤT CẢ các ảnh bên trong nội dung GrapesJS (Bao gồm cả Gallery cũ và mới)
    const contentWrappers = document.querySelectorAll('.grapesjs-content-wrapper');
    let allImgsList = [];
    
    contentWrappers.forEach(wrapper => {
      // Tìm tất cả ảnh, loại trừ ảnh quá nhỏ (như icon) hoặc ảnh overlay
      const allImgs = Array.from(wrapper.querySelectorAll('img')).filter(img => {
        // Có thể lọc bớt ảnh icon nếu cần, hiện tại lấy hết ảnh có source hợp lệ
        return img.src && !img.src.startsWith('data:image/svg+xml');
      });

      allImgs.forEach((img) => {
        img.style.cursor = 'zoom-in'; // Thêm cursor báo hiệu có thể click
        
        const src = img.src;
        const index = allImgsList.length;
        allImgsList.push(src);

        const handleClick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          setImages(allImgsList);
          setCurrentIndex(index);
          setLightboxOpen(true);
        };

        img.addEventListener('click', handleClick);
        img._cjClickHandler = handleClick; // Lưu reference để dọn dẹp
      });
    });

    return () => {
      // Dọn dẹp event listeners
      document.querySelectorAll('.cj-gallery-prev, .cj-gallery-next').forEach(btn => {
        if (btn._cjHandler) btn.removeEventListener('click', btn._cjHandler);
      });
      document.querySelectorAll('.grapesjs-content-wrapper img').forEach(img => {
        if (img._cjClickHandler) img.removeEventListener('click', img._cjClickHandler);
      });
    };
  }, [htmlContentKey]);

  if (!lightboxOpen) return null;

  const nextImage = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div 
      className="fixed inset-0 z-[99999] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={() => setLightboxOpen(false)} // Bấm ra ngoài để đóng
    >
      <button 
        onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); }}
        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 bg-black/20 rounded-full hover:bg-black/40"
      >
        <X className="w-8 h-8" />
      </button>
      
      {images.length > 1 && (
        <button 
          onClick={prevImage}
          className="absolute left-6 text-white/70 hover:text-white transition-transform hover:scale-110 p-3 bg-black/20 rounded-full hover:bg-black/40"
        >
          <ChevronLeft className="w-10 h-10" />
        </button>
      )}

      <img 
        src={images[currentIndex]} 
        alt="Full size" 
        className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl select-none"
        onClick={(e) => e.stopPropagation()} // Ngăn việc bấm vào ảnh làm đóng lightbox
      />

      {images.length > 1 && (
        <button 
          onClick={nextImage}
          className="absolute right-6 text-white/70 hover:text-white transition-transform hover:scale-110 p-3 bg-black/20 rounded-full hover:bg-black/40"
        >
          <ChevronRight className="w-10 h-10" />
        </button>
      )}
      
      <div className="absolute bottom-6 text-white text-sm font-medium tracking-widest bg-black/40 px-4 py-2 rounded-full">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};

export default GalleryEnhancer;
