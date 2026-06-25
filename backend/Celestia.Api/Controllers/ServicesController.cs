using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Celestia.Api.Data;
using Celestia.Api.Models;
using Microsoft.AspNetCore.Authorization;

namespace Celestia.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServicesController : ControllerBase
    {
        private readonly CelestiaDbContext _context;

        public ServicesController(CelestiaDbContext context)
        {
            _context = context;
        }

        // GET: api/services
        [HttpGet]
        public async Task<IActionResult> GetServices(
            [FromQuery] string type = "", 
            [FromQuery] string search = "",
            [FromQuery] int page = 1,
            [FromQuery] int limit = 10,
            [FromQuery] int? destinationId = null)
        {
            var query = _context.LocalServices
                .Include(s => s.Destination)
                .AsQueryable();

            if (!string.IsNullOrEmpty(type))
            {
                query = query.Where(s => s.Type.ToLower() == type.ToLower());
            }

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(s => s.Name.ToLower().Contains(search.ToLower()) || 
                                         s.Description.ToLower().Contains(search.ToLower()));
            }

            if (destinationId.HasValue)
            {
                query = query.Where(s => s.DestinationId == destinationId.Value);
            }

            var totalItems = await query.CountAsync();
            var totalPages = (int)System.Math.Ceiling(totalItems / (double)limit);
            
            var items = await query
                .OrderByDescending(s => s.Rating)
                .ThenByDescending(s => s.CreatedAt)
                .Skip((page - 1) * limit)
                .Take(limit)
                .Select(s => new LocalServiceDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Type = s.Type,
                    Description = s.Description,
                    Address = s.Address,
                    Phone = s.Phone,
                    ImageUrl = s.ImageUrl,
                    Rating = s.Rating,
                    DestinationId = s.DestinationId
                })
                .ToListAsync();

            return Ok(new
            {
                Data = items,
                Pagination = new
                {
                    TotalItems = totalItems,
                    TotalPages = totalPages,
                    CurrentPage = page,
                    Limit = limit
                }
            });
        }

        // GET: api/services/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetService(int id)
        {
            var service = await _context.LocalServices
                .Include(s => s.Destination)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (service == null)
            {
                return NotFound(new { message = "Không tìm thấy dịch vụ" });
            }

            var dto = new LocalServiceDto
            {
                Id = service.Id,
                Name = service.Name,
                Type = service.Type,
                Description = service.Description,
                Address = service.Address,
                Phone = service.Phone,
                ImageUrl = service.ImageUrl,
                Rating = service.Rating,
                DestinationId = service.DestinationId
            };

            return Ok(dto);
        }

        // POST: api/services
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateService([FromBody] CreateLocalServiceDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var dest = await _context.Destinations.FindAsync(dto.DestinationId);
            if (dest == null)
            {
                return BadRequest(new { message = "Địa điểm không hợp lệ" });
            }

            var service = new LocalService
            {
                Name = dto.Name,
                Type = dto.Type,
                Description = dto.Description,
                Address = dto.Address,
                Phone = dto.Phone,
                ImageUrl = dto.ImageUrl,
                Rating = dto.Rating,
                DestinationId = dto.DestinationId,
                CreatedAt = System.DateTime.UtcNow
            };

            _context.LocalServices.Add(service);
            await _context.SaveChangesAsync();

            var resultDto = new LocalServiceDto
            {
                Id = service.Id,
                Name = service.Name,
                Type = service.Type,
                Description = service.Description,
                Address = service.Address,
                Phone = service.Phone,
                ImageUrl = service.ImageUrl,
                Rating = service.Rating,
                DestinationId = service.DestinationId
            };

            return CreatedAtAction(nameof(GetService), new { id = service.Id }, resultDto);
        }

        // PUT: api/services/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateService(int id, [FromBody] CreateLocalServiceDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var service = await _context.LocalServices.FindAsync(id);
            if (service == null)
            {
                return NotFound(new { message = "Không tìm thấy dịch vụ" });
            }

            var dest = await _context.Destinations.FindAsync(dto.DestinationId);
            if (dest == null)
            {
                return BadRequest(new { message = "Địa điểm không hợp lệ" });
            }

            service.Name = dto.Name;
            service.Type = dto.Type;
            service.Description = dto.Description;
            service.Address = dto.Address;
            service.Phone = dto.Phone;
            service.ImageUrl = dto.ImageUrl;
            service.Rating = dto.Rating;
            service.DestinationId = dto.DestinationId;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật thành công" });
        }

        // DELETE: api/services/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteService(int id)
        {
            var service = await _context.LocalServices.FindAsync(id);
            if (service == null)
            {
                return NotFound(new { message = "Không tìm thấy dịch vụ" });
            }

            _context.LocalServices.Remove(service);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa thành công" });
        }
    }
}
