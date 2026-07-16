import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// Chế độ Toast (Thông báo trượt góc)
const Toast = MySwal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

/**
 * Hiển thị thông báo Toast nhanh
 * @param {string} title Nội dung thông báo
 * @param {string} icon 'success' | 'error' | 'warning' | 'info'
 */
export const showToast = (title, icon = 'success') => {
  Toast.fire({
    icon: icon,
    title: title
  });
};

/**
 * Hiển thị bảng xác nhận (Confirm Dialog)
 * @param {string} title Tiêu đề bảng hỏi
 * @param {string} text Nội dung chi tiết
 * @param {string} confirmText Chữ trên nút Đồng ý
 * @returns {Promise<boolean>} Trả về true nếu người dùng chọn Đồng ý
 */
export const confirmAction = async (title, text = "Bạn sẽ không thể khôi phục thao tác này!", confirmText = "Có, chắc chắn!") => {
  const result = await MySwal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#14b8a6', // primary color
    cancelButtonColor: '#f43f5e', // red-500
    confirmButtonText: confirmText,
    cancelButtonText: 'Hủy bỏ'
  });
  
  return result.isConfirmed;
};
