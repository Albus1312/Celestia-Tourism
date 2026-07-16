using Celestia.Classes;
using Celestia.Includes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using System;

namespace Celestia.Modules
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;

        public PaymentController(ApplicationDbContext context, IEmailService emailService, IConfiguration configuration)
        {
            _context = context;
            _emailService = emailService;
            _configuration = configuration;
        }

        [Authorize(Roles = "Traveler")]
        [HttpGet("generate-qr/{bookingId}")]
        public async Task<ActionResult> GenerateVietQR(int bookingId)
        {
            var booking = await _context.Bookings.FirstOrDefaultAsync(b => b.Id == bookingId);
            if (booking == null) return NotFound("Booking not found");

            var vietQRConfig = _configuration.GetSection("VietQR");
            var bankId = vietQRConfig["BankId"];
            var accountNo = vietQRConfig["AccountNo"];
            var accountName = vietQRConfig["AccountName"];
            var template = vietQRConfig["Template"];

            var amount = booking.TotalAmount;
            var description = $"CELESTIA ORDER {booking.Id}";

            // Using VietQR API standard structure
            var qrUrl = $"https://img.vietqr.io/image/{bankId}-{accountNo}-{template}.png?amount={amount}&addInfo={Uri.EscapeDataString(description)}&accountName={Uri.EscapeDataString(accountName)}";

            return Ok(new { qrUrl = qrUrl, amount = amount, description = description, accountNo = accountNo, accountName = accountName });
        }

        [Authorize(Roles = "Traveler,Admin")]
        [HttpPost("confirm/{bookingId}")]
        public async Task<ActionResult> ConfirmPayment(int bookingId)
        {
            var result = await ConfirmPaymentInternal(bookingId, null);
            if (!result) return NotFound("Booking not found or already confirmed");
            return Ok(new { message = "Payment confirmed and email sent successfully." });
        }

        [AllowAnonymous]
        [HttpPost("webhook")]
        public async Task<IActionResult> Webhook([FromBody] System.Text.Json.JsonElement payload)
        {
            try
            {
                string description = "";
                decimal amount = 0;

                // Try parse Casso format
                if (payload.TryGetProperty("data", out var dataElement) && dataElement.ValueKind == System.Text.Json.JsonValueKind.Array && dataElement.GetArrayLength() > 0)
                {
                    var firstItem = dataElement[0];
                    description = firstItem.GetProperty("description").GetString() ?? "";
                    amount = firstItem.GetProperty("amount").GetDecimal();
                }
                // Try parse SePay format
                else if (payload.TryGetProperty("content", out var contentElement))
                {
                    description = contentElement.GetString() ?? "";
                    amount = payload.GetProperty("transferAmount").GetDecimal();
                }
                else
                {
                    return BadRequest("Unknown webhook format");
                }

                // Extract booking ID from description, e.g. "CELESTIA ORDER 105"
                var match = System.Text.RegularExpressions.Regex.Match(description, @"ORDER\s+(\d+)", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
                if (match.Success)
                {
                    int bookingId = int.Parse(match.Groups[1].Value);
                    await ConfirmPaymentInternal(bookingId, amount);
                }

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [Authorize(Roles = "Traveler")]
        [HttpGet("check-status/{bookingId}")]
        public async Task<ActionResult> CheckStatus(int bookingId)
        {
            var booking = await _context.Bookings.FirstOrDefaultAsync(b => b.Id == bookingId);
            if (booking == null) return NotFound();

            return Ok(new { status = booking.Status.ToString() });
        }

        private async Task<bool> ConfirmPaymentInternal(int bookingId, decimal? verifyAmount)
        {
            var booking = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.TourPackage)
                .Include(b => b.LocalService)
                .FirstOrDefaultAsync(b => b.Id == bookingId);

            if (booking == null || booking.Status == BookingStatus.Confirmed) return false;

            // Optional: verify amount if needed
            // if (verifyAmount.HasValue && verifyAmount.Value < booking.TotalAmount) return false;

            booking.Status = BookingStatus.Confirmed;
            await _context.SaveChangesAsync();

            // Send Confirmation Email
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
            return true;
        }
    }
}
