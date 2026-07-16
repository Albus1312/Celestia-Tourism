# 📘 HƯỚNG DẪN SỬ DỤNG VÀ CÀI ĐẶT ĐỒ ÁN CELESTIA TRAVEL

**Tên dự án:** Celestia Travel - Nền tảng Đặt Tour và Khám phá Du lịch Việt Nam
**Công nghệ sử dụng:**
- **Backend:** C# ASP.NET Core 8 Web API, Entity Framework Core, PostgreSQL.
- **Frontend:** ReactJS, Vite, TailwindCSS v4, GrapesJS (Page Builder), Tiptap (Rich Text Editor).
- **Tích hợp:** Thanh toán VNPay, Gửi Email tự động (SMTP), API Thời tiết.

---

## 🚀 PHẦN 1: HƯỚNG DẪN CÀI ĐẶT VÀ KHỞI CHẠY (DÀNH CHO HỘI ĐỒNG CHẤM THI)

Để hệ thống hoạt động hoàn chỉnh, cần khởi chạy song song cả 2 dịch vụ Backend và Frontend.

### 1.1 Cấu hình Cơ sở dữ liệu
1. Mở file `appsettings.json` trong thư mục `D:\Celestia`.
2. Tìm chuỗi kết nối `DefaultConnection` và thay đổi thông tin `Username` và `Password` cho khớp với tài khoản PostgreSQL trên máy của Giảng viên.
   ```json
   "DefaultConnection": "Host=localhost;Database=CelestiaDB;Username=postgres;Password=MAT_KHAU_CUA_BAN"
   ```

### 1.2 Khởi tạo Dữ liệu (Có 2 cách)

**Cách 1: Khởi tạo mới hoàn toàn (Dùng EF Core Seeder)**
Chạy lệnh sau để tự động tạo Database và seed các dữ liệu mẫu mặc định (bao gồm các bài viết eMagazine và 7 địa điểm du lịch):
```bash
dotnet ef database update
```

**Cách 2: Phục hồi Database đầy đủ (Khuyên dùng)**
Để xem chính xác 100% dữ liệu như lúc nộp bài (bao gồm các đơn đặt tour, đánh giá, tài khoản mới tạo), vui lòng phục hồi từ file Backup có sẵn:
1. Mở công cụ pgAdmin (hoặc psql).
2. Tạo một database mới tên là `CelestiaDB`.
3. Nhấn chuột phải vào database vừa tạo -> Chọn **Restore**.
4. Trỏ đường dẫn đến file `CelestiaDB_Backup.sql` nằm ở thư mục gốc của đồ án và tiến hành phục hồi.

---

### 1.3 Khởi chạy Toàn bộ Hệ thống (Cực kỳ đơn giản)

Chúng tôi đã chuẩn bị sẵn một file Script tự động hoá mọi thao tác để hội đồng chấm thi tiết kiệm thời gian nhất:

1. Vào thư mục gốc của dự án (`D:\Celestia`).
2. Nhấn đúp chuột (Double-click) vào file **`start.bat`**.
3. File này sẽ tự động thực hiện tất cả 4 bước:
   - Cài đặt thư viện Frontend (npm install).
   - Cập nhật Database (dotnet ef database update).
   - Bật Server Backend (.NET 8).
   - Bật Server Frontend (React Vite).
4. Hai cửa sổ Terminal đen sẽ tự động bật lên. Khi tiến trình hoàn tất, bạn chỉ cần mở trình duyệt và truy cập vào địa chỉ: **http://localhost:5173**

---

## 👑 PHẦN 2: CHỨC NĂNG DÀNH CHO QUẢN TRỊ VIÊN (ADMIN)

Tài khoản đăng nhập mặc định: 
- **Email:** `admin@celestia.vn`
- **Mật khẩu:** *(Sử dụng mật khẩu đã thiết lập hoặc xem trong DatabaseSeeder)*

> [!TIP]
> Admin Panel được thiết kế riêng biệt để quản lý toàn diện mọi luồng dữ liệu của hệ thống, từ nội dung tĩnh đến giao dịch thanh toán.

### 1. Bảng điều khiển (Dashboard)
- Xem tổng quan doanh thu, số lượng đơn đặt tour mới, số lượng tài khoản người dùng đăng ký.
- Biểu đồ trực quan theo dõi lượng truy cập và xu hướng đặt tour.

### 2. Quản lý Địa điểm & Tỉnh Thành (Destinations)
- Thêm, Sửa, Xóa các địa danh du lịch tại 63 tỉnh thành phố.
- **Tính năng đặc biệt - Kéo thả giao diện (Page Builder):** Tích hợp công cụ GrapesJS cho phép Admin thiết kế Landing Page (trang đích) cho từng địa điểm bằng cách kéo thả hình ảnh, văn bản, bố cục mà không cần viết code.

### 3. Quản lý Tour & Đặt Tour (Tour & Bookings)
- Đăng tải các Tour du lịch mới kèm theo lộ trình, giá cả, và sức chứa.
- Theo dõi trạng thái các đơn đặt Tour của khách (Chờ xác nhận, Đã thanh toán, Đã hủy).
- Tự động thay đổi trạng thái và gửi Email xác nhận cho khách sau khi khách thanh toán thành công qua VNPay.

### 4. Quản lý eMagazine (Tạp chí Du lịch)
- Soạn thảo các bài viết quảng bá, cẩm nang du lịch chuẩn SEO.
- Sử dụng trình soạn thảo Tiptap Rich Text Editor hỗ trợ đầy đủ định dạng (In đậm, Tiêu đề, Chèn ảnh, Căn lề...).

### 5. Quản lý Mã giảm giá (Promo Codes)
- Tạo mã giảm giá theo phần trăm (%) hoặc số tiền cố định.
- Cài đặt thời hạn, số lượng sử dụng cho các chiến dịch kích cầu du lịch.

---

## 👤 PHẦN 3: CHỨC NĂNG DÀNH CHO KHÁCH HÀNG (CUSTOMER)

Giao diện người dùng được thiết kế theo phong cách hiện đại, mượt mà và tối ưu hóa trải nghiệm (UX/UI).

### 1. Trang chủ & Khám phá Địa điểm
- Trải nghiệm giao diện Landing Page hoành tráng của từng địa điểm (được Admin thiết kế bằng thao tác kéo thả).
- Tra cứu thông tin thời tiết theo thời gian thực tại địa điểm sắp đến.

### 2. Đặt Tour & Thanh toán (Checkout)
- Hệ thống chặn đặt tour trong quá khứ hoặc khi số lượng vé đã hết.
- Nhập mã giảm giá để nhận ưu đãi trực tiếp.
- **Tích hợp cổng thanh toán VNPay:** Mô phỏng quá trình quét mã QR hoặc nhập thẻ ngân hàng thanh toán an toàn.
- Nhận Email vé điện tử tự động ngay sau khi thanh toán thành công.

### 3. Đọc báo eMagazine
- Trải nghiệm đọc tạp chí mượt mà với các bài viết du lịch được trình bày siêu đẹp (Tự động canh lề, ngắt dòng, khoảng cách đoạn qua chuẩn Typography).
- Tham gia bình luận, tương tác bên dưới bài viết.

### 4. Cộng đồng (Community)
- Nơi khách du lịch có thể tự đăng tải bài viết chia sẻ kinh nghiệm, đánh giá chuyến đi.
- Bình luận, "Thích" các bài viết chia sẻ của người dùng khác.

### 5. Quản lý Tài khoản cá nhân
- Cập nhật thông tin hồ sơ (Avatar, tên tuổi).
- Xem lại lịch sử các Tour đã đặt, theo dõi trạng thái đơn hàng và tải lại vé điện tử.

---

> [!IMPORTANT]
> **Ghi chú dành cho sinh viên nộp báo cáo:**
> Đồ án này có cấu trúc kiến trúc phần mềm tiêu chuẩn (Separation of Concerns), phân tách rõ ràng giữa Web API (Backend) và Single Page Application (Frontend), kết hợp với CSDL quan hệ chặt chẽ. Điểm nhấn lớn nhất là việc tích hợp thành công các công nghệ phức tạp như: Hệ thống kéo thả giao diện (GrapesJS), Soạn thảo văn bản đa dạng (Tiptap), Thanh toán điện tử (VNPay), và hệ thống gửi Email tự động.
