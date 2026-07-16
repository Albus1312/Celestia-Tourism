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
    public class CategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Categories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetCategories()
        {
            // Trả về danh mục kèm theo số lượng địa điểm để hiển thị trên bảng
            var categories = await _context.DestinationCategories
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.Slug,
                    c.Description,
                    DestinationCount = c.Destinations.Count
                })
                .ToListAsync();

            return Ok(categories);
        }

        // GET: api/Categories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DestinationCategory>> GetCategory(int id)
        {
            var category = await _context.DestinationCategories.FindAsync(id);

            if (category == null)
            {
                return NotFound();
            }

            return category;
        }

        // POST: api/Categories
        [Authorize(Roles = "Admin,Editor")]
        [HttpPost]
        public async Task<ActionResult<DestinationCategory>> CreateCategory(DestinationCategory category)
        {
            _context.DestinationCategories.Add(category);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, category);
        }

        // PUT: api/Categories/5
        [Authorize(Roles = "Admin,Editor")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, DestinationCategory category)
        {
            if (id != category.Id)
            {
                return BadRequest();
            }

            _context.Entry(category).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoryExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/Categories/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.DestinationCategories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            // Kiểm tra xem có địa điểm nào đang dùng danh mục này không
            var hasDestinations = await _context.Destinations.AnyAsync(d => d.CategoryId == id);
            if (hasDestinations)
            {
                return BadRequest(new { message = "Không thể xóa danh mục đang có địa điểm. Hãy xóa hoặc chuyển địa điểm trước." });
            }

            _context.DestinationCategories.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CategoryExists(int id)
        {
            return _context.DestinationCategories.Any(e => e.Id == id);
        }
    }
}
