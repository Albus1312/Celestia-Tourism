using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using System;
using System.IO;
using System.Threading.Tasks;

namespace Celestia.Modules
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadsController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;

        public UploadsController(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Editor")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "Không tìm thấy file tải lên." });
            }

            // Chỉ chấp nhận file ảnh
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            
            if (Array.IndexOf(allowedExtensions, extension) < 0)
            {
                return BadRequest(new { message = "Chỉ hỗ trợ tải lên file hình ảnh (.jpg, .png, .gif, .webp)." });
            }

            // Giới hạn dung lượng file (ví dụ 5MB)
            if (file.Length > 5 * 1024 * 1024)
            {
                return BadRequest(new { message = "Kích thước file vượt quá 5MB." });
            }

            try
            {
                // Thư mục lưu trữ: wwwroot/uploads
                var uploadsFolder = Path.Combine(_environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads");
                
                // Tạo thư mục nếu chưa tồn tại
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // Đổi tên file để tránh trùng lặp
                var uniqueFileName = Guid.NewGuid().ToString() + extension;
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Trả về đường dẫn công khai (Public URL) tuyệt đối để Frontend có thể hiển thị
                var baseUrl = $"{Request.Scheme}://{Request.Host}";
                var publicUrl = $"{baseUrl}/uploads/{uniqueFileName}";
                
                // Trả về một đối tượng chứa URL
                return Ok(new { url = publicUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi máy chủ khi lưu file: {ex.Message}" });
            }
        }

        [HttpPost("user")]
        [Authorize]
        public async Task<IActionResult> UploadImageUser(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "Không tìm thấy file tải lên." });
            }

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp", ".mp4", ".mov" };
            
            if (Array.IndexOf(allowedExtensions, extension) < 0)
            {
                return BadRequest(new { message = "Chỉ hỗ trợ tải lên file hình ảnh/video (.jpg, .png, .mp4...)." });
            }

            if (file.Length > 20 * 1024 * 1024)
            {
                return BadRequest(new { message = "Kích thước file vượt quá 20MB." });
            }

            try
            {
                var uploadsFolder = Path.Combine(_environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads");
                if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                var uniqueFileName = Guid.NewGuid().ToString() + extension;
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var baseUrl = $"{Request.Scheme}://{Request.Host}";
                var publicUrl = $"{baseUrl}/uploads/{uniqueFileName}";
                
                return Ok(new { url = publicUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi máy chủ: {ex.Message}" });
            }
        }
    }
}
