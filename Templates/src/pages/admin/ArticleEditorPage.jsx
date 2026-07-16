import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { showToast, confirmAction } from '../../utils/alertUtils';

// Cấu hình modules cho ReactQuill
const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{'list': 'ordered'}, {'list': 'bullet'}],
    ['link', 'image', 'video'],
    ['clean']
  ]
};

const ArticleEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        // Lấy theo ID thay vì slug để dễ dàng cho admin
        // Phải dùng /articles trực tiếp vì API /articles/slug/:slug cần slug
        const res = await axiosClient.get('/articles');
        const currentArticle = res.find(a => a.id === parseInt(id));
        
        if (currentArticle) {
          setArticle(currentArticle);
          
          let initialContent = currentArticle.contentJson || '';
          try {
            const parsed = JSON.parse(initialContent);
            if (parsed.sections && Array.isArray(parsed.sections)) {
              initialContent = parsed.sections.map(s => s.htmlRendered).join('');
            }
          } catch (e) {
            // Probably already raw HTML
          }
          
          // Fix broken unsplash images by removing their container divs
          initialContent = initialContent.replace(/<div[^>]*>[\s\S]*?(1559592413710-147fc5e744ec|1559098522-a5e2f785bc0b)[\s\S]*?<\/div>/g, '');
          
          setContent(initialContent);
        } else {
          showToast('Không tìm thấy bài viết!', "error");
          navigate('/admin/articles');
        }
      } catch (error) {
        console.error('Lỗi tải bài viết:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, navigate]);

  const handleSave = async () => {
    if (!article) return;
    
    try {
      setIsSaving(true);
      const payload = {
        ...article,
        contentJson: content
      };
      
      await axiosClient.put(`/articles/${id}`, payload);
      showToast('Đã lưu nội dung thành công!', "success");
      navigate('/admin/articles');
    } catch (error) {
      console.error('Lỗi khi lưu:', error);
      showToast('Không thể lưu nội dung bài viết!', "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Top Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/admin/articles')}
            className="p-2 mr-4 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-full transition-colors"
            title="Quay lại danh sách"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Soạn nội dung: {article?.title}</h1>
            <p className="text-sm text-gray-500">/{article?.slug}</p>
          </div>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary hover:bg-teal-700 text-white px-6 py-2 rounded-lg flex items-center transition-colors shadow-sm disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
          {isSaving ? 'Đang lưu...' : 'Lưu Nội Dung'}
        </button>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
          <ReactQuill 
            theme="snow"
            value={content}
            onChange={setContent}
            modules={quillModules}
            className="flex-1 flex flex-col"
            style={{ minHeight: '500px' }}
          />
        </div>
      </div>
      
      {/* Custom CSS to make ReactQuill expand */}
      <style dangerouslySetInnerHTML={{__html: `
        .ql-container.ql-snow { flex: 1; display: flex; flex-direction: column; font-family: 'Inter', sans-serif; font-size: 1.125rem; }
        .ql-editor { flex: 1; padding: 2rem; line-height: 1.7; }
        .ql-toolbar.ql-snow { border-top-left-radius: 0.75rem; border-top-right-radius: 0.75rem; border-color: #e5e7eb; padding: 1rem; }
        .ql-container.ql-snow { border-bottom-left-radius: 0.75rem; border-bottom-right-radius: 0.75rem; border-color: #e5e7eb; }
      `}} />
    </div>
  );
};

export default ArticleEditorPage;
