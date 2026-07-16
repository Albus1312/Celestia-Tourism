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
    public class LocalServicesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LocalServicesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/LocalServices
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LocalService>>> GetLocalServices()
        {
            return await _context.LocalServices
                .Include(s => s.Destination)
                .ToListAsync();
        }

        // GET: api/LocalServices/5
        [HttpGet("{id}")]
        public async Task<ActionResult<LocalService>> GetLocalService(int id)
        {
            var localService = await _context.LocalServices
                .Include(s => s.Destination)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (localService == null)
            {
                return NotFound();
            }

            return localService;
        }

        // POST: api/LocalServices
        [Authorize(Roles = "Editor,Admin")]
        [HttpPost]
        public async Task<ActionResult<LocalService>> CreateLocalService(LocalService localService)
        {
            _context.LocalServices.Add(localService);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetLocalService), new { id = localService.Id }, localService);
        }

        // PUT: api/LocalServices/5
        [Authorize(Roles = "Editor,Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLocalService(int id, LocalService localService)
        {
            if (id != localService.Id)
            {
                return BadRequest();
            }

            _context.Entry(localService).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LocalServiceExists(id))
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

        // PUT: api/LocalServices/5/gallery
        [Authorize(Roles = "Editor,Admin")]
        [HttpPut("{id}/gallery")]
        public async Task<IActionResult> UpdateLocalServiceGallery(int id, [FromBody] List<string> galleryUrls)
        {
            var service = await _context.LocalServices.FindAsync(id);
            if (service == null)
            {
                return NotFound();
            }

            service.GalleryUrls = galleryUrls;
            await _context.SaveChangesAsync();

            return Ok(service);
        }

        // DELETE: api/LocalServices/5
        [Authorize(Roles = "Editor,Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLocalService(int id)
        {
            var localService = await _context.LocalServices.FindAsync(id);
            if (localService == null)
            {
                return NotFound();
            }

            _context.LocalServices.Remove(localService);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LocalServiceExists(int id)
        {
            return _context.LocalServices.Any(e => e.Id == id);
        }
    }
}
