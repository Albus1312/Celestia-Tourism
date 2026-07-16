using Celestia.Classes;
using Celestia.Includes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System;

namespace Celestia.Modules
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReviewsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Reviews?destinationId=1
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetReviews([FromQuery] int? destinationId, [FromQuery] int? tourId, [FromQuery] int? serviceId)
        {
            var query = _context.Reviews
                .Include(r => r.User)
                .Where(r => r.IsApproved && !r.IsDeleted);

            if (destinationId.HasValue) query = query.Where(r => r.DestinationId == destinationId);
            if (tourId.HasValue) query = query.Where(r => r.TourPackageId == tourId);
            if (serviceId.HasValue) query = query.Where(r => r.LocalServiceId == serviceId);

            var reviews = await query
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new {
                    r.Id,
                    r.Rating,
                    r.Comment,
                    r.CreatedAt,
                    r.ReportCount,
                    UserName = r.User != null ? r.User.FullName : "Người dùng ẩn danh",
                    UserAvatar = "https://ui-avatars.com/api/?name=" + (r.User != null ? r.User.FullName : "User")
                })
                .ToListAsync();

            return Ok(reviews);
        }

        // POST: api/Reviews
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Review>> AddReview(Review review)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
            {
                return Unauthorized();
            }

            review.UserId = userId;
            review.CreatedAt = DateTime.UtcNow;
            review.IsApproved = true; // Auto approve by default
            review.ReportCount = 0;
            
            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            // Update rating of the target entity
            if (review.DestinationId.HasValue)
            {
                var dest = await _context.Destinations.FindAsync(review.DestinationId);
                if (dest != null)
                {
                    var avg = await _context.Reviews.Where(r => r.DestinationId == dest.Id && r.IsApproved && !r.IsDeleted).AverageAsync(r => (double?)r.Rating) ?? 0;
                    dest.Rating = Math.Round(avg, 1);
                }
            }
            if (review.LocalServiceId.HasValue)
            {
                var service = await _context.LocalServices.FindAsync(review.LocalServiceId);
                if (service != null)
                {
                    var avg = await _context.Reviews.Where(r => r.LocalServiceId == service.Id && r.IsApproved && !r.IsDeleted).AverageAsync(r => (double?)r.Rating) ?? 0;
                    service.Rating = Math.Round(avg, 1);
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Review added successfully", id = review.Id });
        }

        // POST: api/Reviews/5/report
        [HttpPost("{id}/report")]
        public async Task<IActionResult> ReportReview(int id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null) return NotFound();

            review.ReportCount += 1;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Reported successfully", reportCount = review.ReportCount });
        }

        // === ADMIN ENDPOINTS ===

        [Authorize(Roles = "Admin,Editor")]
        [HttpGet("admin")]
        public async Task<ActionResult<IEnumerable<object>>> AdminGetReviews()
        {
            var reviews = await _context.Reviews
                .Include(r => r.User)
                .Include(r => r.Destination)
                .Include(r => r.TourPackage)
                .Include(r => r.LocalService)
                .Where(r => !r.IsDeleted)
                .OrderByDescending(r => r.ReportCount) // Đưa bình luận bị report lên đầu
                .ThenByDescending(r => r.CreatedAt)
                .Select(r => new {
                    r.Id,
                    r.Rating,
                    r.Comment,
                    r.CreatedAt,
                    r.IsApproved,
                    r.ReportCount,
                    UserName = r.User != null ? r.User.FullName : "Ẩn danh",
                    TargetName = r.Destination != null ? "[Địa điểm] " + r.Destination.Name : 
                                 r.TourPackage != null ? "[Tour] " + r.TourPackage.Name : 
                                 r.LocalService != null ? "[Dịch vụ] " + r.LocalService.Name : "Khác"
                })
                .ToListAsync();

            return Ok(reviews);
        }

        [Authorize(Roles = "Admin,Editor")]
        [HttpPut("admin/{id}/toggle-approve")]
        public async Task<IActionResult> AdminToggleApprove(int id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null) return NotFound();

            review.IsApproved = !review.IsApproved;
            
            // Reset report count if approved again
            if (review.IsApproved) review.ReportCount = 0;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Status toggled", isApproved = review.IsApproved });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("admin/{id}")]
        public async Task<IActionResult> AdminDeleteReview(int id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null) return NotFound();

            review.IsDeleted = true;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Review deleted" });
        }
    }
}
