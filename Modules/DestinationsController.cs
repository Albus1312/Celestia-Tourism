using Celestia.Classes;
using Celestia.Includes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Celestia.Modules
{
    [Route("api/[controller]")]
    [ApiController]
    public class DestinationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DestinationsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Destinations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Destination>>> GetDestinations()
        {
            return await _context.Destinations
                .Include(d => d.Province)
                .Include(d => d.Category)
                .Include(d => d.LocalServices)
                .ToListAsync();
        }

        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<DestinationCategory>>> GetCategories()
        {
            return await _context.DestinationCategories.ToListAsync();
        }

        // GET: api/Destinations/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Destination>> GetDestination(int id)
        {
            var destination = await _context.Destinations
                .Include(d => d.Province)
                .Include(d => d.Category)
                .Include(d => d.LocalServices)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (destination == null)
            {
                return NotFound();
            }

            return destination;
        }

        // POST: api/Destinations
        [Authorize(Roles = "Admin,Editor")]
        [HttpPost]
        public async Task<ActionResult<Destination>> CreateDestination(Destination destination)
        {
            _context.Destinations.Add(destination);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDestination), new { id = destination.Id }, destination);
        }

        // PUT: api/Destinations/5
        [Authorize(Roles = "Admin,Editor")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDestination(int id, Destination destination)
        {
            if (id != destination.Id)
            {
                return BadRequest();
            }

            _context.Entry(destination).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DestinationExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // PUT: api/Destinations/5/gallery
        [Authorize(Roles = "Admin,Editor")]
        [HttpPut("{id}/gallery")]
        public async Task<IActionResult> UpdateDestinationGallery(int id, [FromBody] List<string> galleryUrls)
        {
            var destination = await _context.Destinations.FindAsync(id);
            if (destination == null)
            {
                return NotFound();
            }

            destination.GalleryUrls = galleryUrls;
            await _context.SaveChangesAsync();

            return Ok(destination);
        }

        // DELETE: api/Destinations/5 (Soft Delete)
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDestination(int id)
        {
            var destination = await _context.Destinations.FindAsync(id);
            if (destination == null)
            {
                return NotFound();
            }

            destination.IsDeleted = true;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("{id}/featured-items")]
        public async Task<ActionResult<object>> GetFeaturedItems(int id)
        {
            // Lấy ngẫu nhiên hoặc mới nhất tối đa 3 item
            var tours = await _context.TourPackages
                .Where(t => t.DestinationId == id && t.IsFeatured && !t.IsDeleted)
                .OrderByDescending(t => t.Id)
                .Take(3)
                .ToListAsync();

            var services = await _context.LocalServices
                .Where(s => s.DestinationId == id && s.IsFeatured && s.IsActive && !s.IsDeleted)
                .OrderByDescending(s => s.Id)
                .Take(3)
                .ToListAsync();

            return new { tours, services };
        }

        [HttpGet("{id}/all-items")]
        public async Task<ActionResult<object>> GetAllItems(int id)
        {
            var tours = await _context.TourPackages
                .Where(t => t.DestinationId == id && !t.IsDeleted)
                .OrderByDescending(t => t.Id)
                .ToListAsync();

            var services = await _context.LocalServices
                .Where(s => s.DestinationId == id && !s.IsDeleted)
                .OrderByDescending(s => s.Id)
                .ToListAsync();

            return new { tours, services };
        }

        public class ManageFeaturedRequest
        {
            public List<int> TourIds { get; set; } = new List<int>();
            public List<int> ServiceIds { get; set; } = new List<int>();
        }

        [Authorize(Roles = "Admin,Editor")]
        [HttpPost("{id}/manage-featured")]
        public async Task<IActionResult> ManageFeatured(int id, [FromBody] ManageFeaturedRequest request)
        {
            if (!DestinationExists(id)) return NotFound();

            var tours = await _context.TourPackages.Where(t => t.DestinationId == id).ToListAsync();
            foreach (var tour in tours)
            {
                tour.IsFeatured = request.TourIds.Contains(tour.Id);
                _context.Entry(tour).State = EntityState.Modified;
            }

            var services = await _context.LocalServices.Where(s => s.DestinationId == id).ToListAsync();
            foreach (var service in services)
            {
                service.IsFeatured = request.ServiceIds.Contains(service.Id);
                _context.Entry(service).State = EntityState.Modified;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật danh sách nổi bật thành công" });
        }

        private bool DestinationExists(int id)
        {
            return _context.Destinations.Any(e => e.Id == id);
        }
    }
}
