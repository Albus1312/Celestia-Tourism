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
    public class TourPackagesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TourPackagesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/TourPackages
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TourPackage>>> GetTourPackages()
        {
            return await _context.TourPackages
                .Include(t => t.Destination)
                .Include(t => t.Author)
                .OrderByDescending(t => t.Id)
                .ToListAsync();
        }

        // GET: api/TourPackages/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TourPackage>> GetTourPackage(int id)
        {
            var tourPackage = await _context.TourPackages
                .Include(t => t.Destination)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (tourPackage == null)
            {
                return NotFound();
            }

            return tourPackage;
        }

        // POST: api/TourPackages
        [Authorize(Roles = "Admin,Editor")]
        [HttpPost]
        public async Task<ActionResult<TourPackage>> PostTourPackage(TourPackage tourPackage)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!string.IsNullOrEmpty(userIdString) && int.TryParse(userIdString, out int userId))
            {
                tourPackage.AuthorId = userId;
            }

            _context.TourPackages.Add(tourPackage);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTourPackage", new { id = tourPackage.Id }, tourPackage);
        }

        // PUT: api/TourPackages/5
        [Authorize(Roles = "Admin,Editor")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTourPackage(int id, TourPackage tourPackage)
        {
            if (id != tourPackage.Id)
            {
                return BadRequest();
            }

            _context.Entry(tourPackage).State = EntityState.Modified;

            // Đảm bảo không ghi đè AuthorId cũ
            _context.Entry(tourPackage).Property(x => x.AuthorId).IsModified = false;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TourPackageExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // PUT: api/TourPackages/5/gallery
        [Authorize(Roles = "Admin,Editor")]
        [HttpPut("{id}/gallery")]
        public async Task<IActionResult> UpdateTourGallery(int id, [FromBody] List<string> galleryUrls)
        {
            var tour = await _context.TourPackages.FindAsync(id);
            if (tour == null)
            {
                return NotFound();
            }

            tour.GalleryUrls = galleryUrls;
            await _context.SaveChangesAsync();

            return Ok(tour);
        }

        // DELETE: api/TourPackages/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTourPackage(int id)
        {
            var tourPackage = await _context.TourPackages.FindAsync(id);
            if (tourPackage == null)
            {
                return NotFound();
            }

            // Kiểm tra xem có người đã đặt tour này chưa
            var hasBookings = await _context.Bookings.AnyAsync(b => b.TourPackageId == id);
            if (hasBookings)
            {
                return BadRequest(new { message = "Không thể xóa Gói Tour đang có người đặt. Hãy xử lý Đơn đặt trước." });
            }

            _context.TourPackages.Remove(tourPackage);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TourPackageExists(int id)
        {
            return _context.TourPackages.Any(e => e.Id == id);
        }
    }
}
