using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Celestia.Api.Data;
using Celestia.Api.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Celestia.Api.Controllers
{
    [ApiController]
    [Route("api/bookings")]
    public class BookingsController : ControllerBase
    {
        private readonly CelestiaDbContext _context;

        public BookingsController(CelestiaDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] Booking dto)
        {
            if (dto.NumberOfPeople <= 0)
                return BadRequest("Number of people must be greater than zero.");

            // In a real application, UserId would come from JWT token claims
            // Here we just use the provided UserId or a default for testing
            if (dto.UserId == 0)
            {
                // Assign a dummy user if none exists
                var defaultUser = await _context.Users.FirstOrDefaultAsync();
                if (defaultUser == null)
                    return BadRequest("No users exist in the system to create a booking.");
                dto.UserId = defaultUser.Id;
            }

            dto.BookingDate = DateTime.UtcNow;
            dto.Status = "Pending";
            
            _context.Bookings.Add(dto);
            await _context.SaveChangesAsync();

            // Auto-create a pending payment record
            var payment = new Payment
            {
                BookingId = dto.Id,
                Amount = dto.TotalAmount,
                PaymentMethod = "VNPay",
                TransactionId = Guid.NewGuid().ToString("N"),
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };
            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Booking created successfully", bookingId = dto.Id });
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserBookings(int userId)
        {
            var bookings = await _context.Bookings
                .Include(b => b.TourPackage)
                    .ThenInclude(t => t.Destination)
                .Where(b => b.UserId == userId)
                .OrderByDescending(b => b.BookingDate)
                .Select(b => new
                {
                    b.Id,
                    TourName = b.TourPackage.Name,
                    DestinationName = b.TourPackage.Destination.Name,
                    b.BookingDate,
                    b.TravelDate,
                    b.NumberOfPeople,
                    b.TotalAmount,
                    b.Status
                })
                .ToListAsync();

            return Ok(bookings);
        }
    }
}
