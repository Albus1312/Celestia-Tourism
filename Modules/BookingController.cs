using Celestia.Classes;
using Celestia.Includes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Celestia.Modules
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;

        public BookingController(ApplicationDbContext context, IEmailService emailService, IConfiguration configuration)
        {
            _context = context;
            _emailService = emailService;
            _configuration = configuration;
        }

        // GET: api/Booking/Tours
        [HttpGet("tours")]
        public async Task<ActionResult<IEnumerable<TourPackage>>> GetTours()
        {
            return await _context.TourPackages.Include(t => t.Destination).ToListAsync();
        }

        // POST: api/Booking/book
        [Authorize(Roles = "Traveler")]
        [HttpPost("book")]
        public async Task<ActionResult<Booking>> CreateBooking(Booking booking)
        {
            if (booking.TravelDate.Date < System.DateTime.Today)
            {
                return BadRequest(new { message = "Không thể đặt dịch vụ cho ngày trong quá khứ." });
            }

            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
            {
                return Unauthorized();
            }

            booking.UserId = userId;
            booking.Status = BookingStatus.Pending;
            string itemName = "Dịch vụ Celestia";
            
            // Tính toán tổng tiền dựa vào số lượng người và giá tour/dịch vụ
            if (booking.TourPackageId.HasValue) 
            {
                var tour = await _context.TourPackages.FindAsync(booking.TourPackageId.Value);
                if (tour != null) {
                    booking.TotalAmount = tour.Price * booking.NumberOfPeople;
                    itemName = tour.Name;
                }
            }
            else if (booking.LocalServiceId.HasValue)
            {
                var service = await _context.LocalServices.FindAsync(booking.LocalServiceId.Value);
                if (service != null) {
                    booking.TotalAmount = service.Price * booking.NumberOfPeople;
                    itemName = service.Name;
                }
            }
            
            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            // Notify Admin
            var adminEmail = _configuration["EmailConfiguration:AdminEmail"];
            if (!string.IsNullOrEmpty(adminEmail))
            {
                var adminSubject = $"[Celestia Admin] CÓ ĐƠN HÀNG MỚI #{booking.Id}";
                var adminMsg = $@"
                    <h3>Có đơn đặt hàng mới chờ thanh toán</h3>
                    <p><strong>Mã đơn:</strong> #{booking.Id}</p>
                    <p><strong>Khách hàng ID:</strong> {booking.UserId}</p>
                    <p><strong>Dịch vụ:</strong> {itemName}</p>
                    <p><strong>Tổng tiền:</strong> {booking.TotalAmount.ToString("N0")} VNĐ</p>
                    <p>Vui lòng kiểm tra biến động số dư ngân hàng và vào hệ thống duyệt đơn!</p>
                ";
                await _emailService.SendEmailAsync(adminEmail, adminSubject, adminMsg);
            }

            return Ok(new { message = "Booking successful", bookingId = booking.Id });
        }

        // GET: api/Booking/MyBookings
        [Authorize(Roles = "Traveler")]
        [HttpGet("my-bookings")]
        public async Task<ActionResult<IEnumerable<Booking>>> GetMyBookings()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
            {
                return Unauthorized();
            }

            return await _context.Bookings
                .Include(b => b.TourPackage)
                .Include(b => b.LocalService)
                .Where(b => b.UserId == userId)
                .ToListAsync();
        }

        // PUT: api/Booking/{id}/cancel
        [Authorize(Roles = "Traveler")]
        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> CancelBooking(int id)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
            {
                return Unauthorized();
            }

            var booking = await _context.Bookings.FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);
            if (booking == null) return NotFound();

            if (booking.Status != BookingStatus.Pending)
            {
                return BadRequest(new { message = "Chỉ có thể hủy đơn hàng đang chờ xử lý." });
            }

            booking.Status = BookingStatus.Cancelled;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã hủy đơn hàng thành công" });
        }

        // GET: api/Booking/All (Admin)
        [Authorize(Roles = "Admin")]
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<Booking>>> GetAllBookings()
        {
            return await _context.Bookings
                .Include(b => b.TourPackage)
                .Include(b => b.LocalService)
                .Include(b => b.User)
                .ToListAsync();
        }
        
        // PUT: api/Booking/UpdateStatus (Admin)
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateBookingStatus(int id, [FromBody] BookingStatus status)
        {
            var booking = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.TourPackage)
                .Include(b => b.LocalService)
                .FirstOrDefaultAsync(b => b.Id == id);
            
            if (booking == null) return NotFound();

            var oldStatus = booking.Status;
            booking.Status = status;
            await _context.SaveChangesAsync();

            // Send Confirmation Email if changed to Confirmed
            if (status == BookingStatus.Confirmed && oldStatus == BookingStatus.Pending)
            {
                var itemName = booking.TourPackage != null ? booking.TourPackage.Name : booking.LocalService?.Name;
                var travelDate = booking.TravelDate.ToString("dd/MM/yyyy");

                var subject = $"[Celestia] Xác nhận thanh toán thành công - Mã vé #{booking.Id}";
                var htmlMessage = $@"
                    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;'>
                        <div style='background-color: #0f766e; padding: 20px; text-align: center;'>
                            <h2 style='color: white; margin: 0;'>CELESTIA TRAVEL</h2>
                        </div>
                        <div style='padding: 30px; background-color: #ffffff;'>
                            <h3 style='color: #333;'>Xin chào {booking.User.FullName},</h3>
                            <p style='color: #555; font-size: 16px; line-height: 1.5;'>Chúng tôi đã nhận được thanh toán cho đơn hàng <strong>#{booking.Id}</strong> của bạn.</p>
                            
                            <div style='background-color: #f9fafb; border-left: 4px solid #0f766e; padding: 15px; margin: 20px 0;'>
                                <p style='margin: 5px 0;'><strong>Dịch vụ:</strong> {itemName}</p>
                                <p style='margin: 5px 0;'><strong>Ngày đi:</strong> {travelDate}</p>
                                <p style='margin: 5px 0;'><strong>Số khách:</strong> {booking.NumberOfPeople}</p>
                                <p style='margin: 5px 0;'><strong>Tổng thanh toán:</strong> {booking.TotalAmount.ToString("N0")} VNĐ</p>
                            </div>
                            
                            <p style='color: #555; font-size: 16px; line-height: 1.5;'>Vui lòng xuất trình email này hoặc mã đặt chỗ khi sử dụng dịch vụ.</p>
                            <p style='color: #555; font-size: 16px; line-height: 1.5;'>Chúc bạn có một chuyến đi tuyệt vời!</p>
                        </div>
                        <div style='background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #888;'>
                            &copy; 2026 Celestia Travel. All rights reserved.
                        </div>
                    </div>";

                await _emailService.SendEmailAsync(booking.User.Email, subject, htmlMessage);
            }

            return Ok(new { message = "Status updated successfully" });
        }
    }
}
