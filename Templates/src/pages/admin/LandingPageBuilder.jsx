import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import VisualBuilder from '../../components/VisualBuilder';
import { showToast, confirmAction } from '../../utils/alertUtils';

const LandingPageBuilder = () => {
  const { destinationId } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [destinationName, setDestinationName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchConfig();
  }, [destinationId]);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      // Fetch thông tin Destination
      const destData = await axiosClient.get(`/destinations/${destinationId}`);
      setDestinationName(destData.name);

      // Fetch Cấu hình Landing Page
      try {
        const configData = await axiosClient.get(`/landingpage/destination/${destinationId}`);
        // Chuyển đổi Sections thành Chuỗi JSON để nhét vào GrapesJS
        if (configData && configData.sections && configData.sections.length > 0) {
          // Giả sử ta lấy ContentJson từ phần tử đầu tiên (hoặc thiết kế lại DB để lưu nguyên cục)
          // Theo DB thiết kế: LandingPageSections có ContentJson
          // Để đơn giản với Grapes, ta gộp lại thành 1 cục thiết kế chính
          const mainSection = configData.sections.find(s => s.sectionType === 'MainContent');
          if (mainSection && mainSection.contentJson) {
             setInitialData(mainSection.contentJson);
          }
        }
      } catch (err) {
        // Chưa có config (404), không sao, dùng data rỗng
        console.log("Chưa có cấu hình Landing Page, sẽ tạo mới.");
      }
    } catch (error) {
      console.error('Lỗi tải dữ liệu:', error);
      showToast('Không tìm thấy địa điểm!', "error");
      navigate('/admin/destinations');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async ({ contentJson, html, css }) => {
    try {
      // Gọi API cập nhật Landing Page Config
      const configPayload = {
        destinationId: parseInt(destinationId),
        heroTitle: `Khám phá ${destinationName}`,
        sections: [
          {
            sectionType: 'MainContent',
            sortOrder: 1,
            contentJson: contentJson, // Lưu JSON của GrapeJS
            htmlRendered: html,       // Lưu HTML thuần để Frontend render nhanh
            cssRendered: css
          }
        ]
      };

      await axiosClient.put(`/landingpage/destination/${destinationId}`, configPayload);
      showToast('Đã lưu thiết kế thành công!', "success");
    } catch (error) {
      console.error('Lỗi khi lưu:', error);
      showToast('Có lỗi xảy ra khi lưu thiết kế.', "error");
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Đang tải Trình Kiến tạo...</div>;
  }

  return (
    <VisualBuilder 
      initialData={initialData} 
      onSave={handleSave} 
      title={`Thiết kế Landing Page: ${destinationName}`} 
    />
  );
};

export default LandingPageBuilder;
