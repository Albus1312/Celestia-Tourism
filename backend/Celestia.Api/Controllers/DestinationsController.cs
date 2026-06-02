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
    [Route("api/destinations")]
    public class DestinationsController : ControllerBase
    {
        private readonly CelestiaDbContext _context;

        public DestinationsController(CelestiaDbContext context)
        {
            _context = context;
        }

        // GET: api/destinations
        [HttpGet]
        public async Task<IActionResult> GetDestinations(
            [FromQuery] string? search,
            [FromQuery] string? category,
            [FromQuery] string? region,
            [FromQuery] string? province)
        {
            var query = _context.Destinations
                .Include(d => d.Province)
                .ThenInclude(p => p!.Region)
                .Include(d => d.Category)
                .Include(d => d.LandingPageConfig)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var lowerSearch = search.ToLower();
                query = query.Where(d => d.Name.ToLower().Contains(lowerSearch) || 
                                         d.Description.ToLower().Contains(lowerSearch) ||
                                         d.Location.ToLower().Contains(lowerSearch));
            }

            if (!string.IsNullOrWhiteSpace(category))
            {
                query = query.Where(d => d.Category!.Slug == category);
            }

            if (!string.IsNullOrWhiteSpace(region))
            {
                query = query.Where(d => d.Province!.RegionId == region);
            }

            if (!string.IsNullOrWhiteSpace(province))
            {
                query = query.Where(d => d.ProvinceId == province);
            }

            var list = await query.Select(d => new DestinationSummaryDto
            {
                Id = d.Id,
                Name = d.Name,
                Slug = d.Slug,
                Description = d.Description,
                Location = d.Location,
                ProvinceId = d.ProvinceId,
                ProvinceName = d.Province != null ? d.Province.Name : "",
                RegionId = d.Province != null ? d.Province.RegionId : "",
                CategorySlug = d.Category != null ? d.Category.Slug : "",
                CategoryName = d.Category != null ? d.Category.Name : "",
                Rating = d.Rating,
                ThumbnailUrl = d.ThumbnailUrl,
                ThemeId = d.LandingPageConfig != null ? d.LandingPageConfig.ThemeId : "ocean-breeze"
            }).ToListAsync();

            return Ok(list);
        }

        // GET: api/destinations/{idOrSlug}
        [HttpGet("{idOrSlug}")]
        public async Task<IActionResult> GetDestination(string idOrSlug)
        {
            Destination? destination;

            if (int.TryParse(idOrSlug, out int id))
            {
                destination = await _context.Destinations
                    .Include(d => d.Province)
                    .Include(d => d.Category)
                    .Include(d => d.Reviews)
                    .FirstOrDefaultAsync(d => d.Id == id);
            }
            else
            {
                destination = await _context.Destinations
                    .Include(d => d.Province)
                    .Include(d => d.Category)
                    .Include(d => d.Reviews)
                    .FirstOrDefaultAsync(d => d.Slug == idOrSlug);
            }

            if (destination == null)
            {
                return NotFound(new { message = "Không tìm thấy địa điểm du lịch này!" });
            }

            // Track a page view asynchronously to feed analytics data!
            try
            {
                var userAgent = Request.Headers["User-Agent"].ToString();
                var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
                var device = "desktop";
                if (userAgent.Contains("Mobile") || userAgent.Contains("Android") || userAgent.Contains("iPhone"))
                    device = "mobile";
                else if (userAgent.Contains("iPad") || userAgent.Contains("Tablet"))
                    device = "tablet";

                var locations = new[] { "Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Nha Trang", "International (USA)", "International (Japan)" };
                var randomLoc = locations[new Random().Next(locations.Length)];

                _context.PageViews.Add(new PageView
                {
                    DestinationId = destination.Id,
                    Timestamp = DateTime.UtcNow,
                    IpAddress = ip,
                    UserAgent = userAgent,
                    DeviceType = device,
                    RegionName = randomLoc
                });
                await _context.SaveChangesAsync();
            }
            catch
            {
                // Silently bypass analytics logging errors in sandbox
            }

            return Ok(new
            {
                destination.Id,
                destination.Name,
                destination.Slug,
                destination.Description,
                destination.DetailedDescription,
                destination.Location,
                destination.Latitude,
                destination.Longitude,
                ProvinceName = destination.Province?.Name,
                ProvinceId = destination.ProvinceId,
                CategoryName = destination.Category?.Name,
                CategorySlug = destination.Category?.Slug,
                destination.Rating,
                destination.ThumbnailUrl,
                destination.CoverUrl,
                destination.CreatedAt,
                Reviews = destination.Reviews.OrderByDescending(r => r.CreatedAt).Select(r => new
                {
                    r.Id,
                    r.AuthorName,
                    r.Rating,
                    r.Comment,
                    r.CreatedAt
                })
            });
        }

        // POST: api/destinations/{id}/reviews
        [HttpPost("{id}/reviews")]
        public async Task<IActionResult> AddReview(int id, [FromBody] CreateReviewDto reviewDto)
        {
            if (reviewDto == null || string.IsNullOrWhiteSpace(reviewDto.AuthorName) || reviewDto.Rating < 1 || reviewDto.Rating > 5)
            {
                return BadRequest(new { message = "Thông tin bình luận và đánh giá không hợp lệ. Số sao từ 1 đến 5." });
            }

            var destination = await _context.Destinations.Include(d => d.Reviews).FirstOrDefaultAsync(d => d.Id == id);
            if (destination == null)
            {
                return NotFound(new { message = "Không tìm thấy địa điểm du lịch!" });
            }

            var review = new Review
            {
                DestinationId = id,
                AuthorName = reviewDto.AuthorName,
                Rating = reviewDto.Rating,
                Comment = reviewDto.Comment,
                CreatedAt = DateTime.UtcNow
            };

            _context.Reviews.Add(review);
            
            // Recalculate average rating
            destination.Reviews.Add(review);
            destination.Rating = Math.Round(destination.Reviews.Average(r => r.Rating), 1);
            
            await _context.SaveChangesAsync();

            return Ok(new
            {
                review.Id,
                review.AuthorName,
                review.Rating,
                review.Comment,
                review.CreatedAt,
                NewAverageRating = destination.Rating
            });
        }

        // GET: api/destinations/meta
        [HttpGet("meta")]
        public async Task<IActionResult> GetMetadata()
        {
            var categories = await _context.DestinationCategories.Select(c => new
            {
                c.Id,
                c.Name,
                c.Slug,
                c.Description,
                c.Icon
            }).ToListAsync();

            var regions = await _context.Regions.Select(r => new
            {
                r.Id,
                r.Name,
                r.Description
            }).ToListAsync();

            var provinces = await _context.Provinces.Select(p => new
            {
                p.Id,
                p.Name,
                p.RegionId
            }).ToListAsync();

            return Ok(new { categories, regions, provinces });
        }
    }
}
