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
    [Route("api/favorites")]
    public class FavoritesController : ControllerBase
    {
        private readonly CelestiaDbContext _context;

        public FavoritesController(CelestiaDbContext context)
        {
            _context = context;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserFavorites(int userId)
        {
            var favorites = await _context.UserFavorites
                .Include(f => f.Destination)
                .Where(f => f.UserId == userId)
                .OrderByDescending(f => f.CreatedAt)
                .Select(f => new
                {
                    f.DestinationId,
                    DestinationName = f.Destination.Name,
                    f.Destination.ThumbnailUrl,
                    f.Destination.Location,
                    f.CreatedAt
                })
                .ToListAsync();

            return Ok(favorites);
        }

        [HttpPost]
        public async Task<IActionResult> ToggleFavorite([FromBody] UserFavorite dto)
        {
            if (dto.UserId == 0 || dto.DestinationId == 0) return BadRequest("Invalid request.");

            var existing = await _context.UserFavorites
                .FirstOrDefaultAsync(f => f.UserId == dto.UserId && f.DestinationId == dto.DestinationId);

            if (existing != null)
            {
                // Unfavorite
                _context.UserFavorites.Remove(existing);
                await _context.SaveChangesAsync();
                return Ok(new { isFavorited = false });
            }
            else
            {
                // Favorite
                dto.CreatedAt = DateTime.UtcNow;
                _context.UserFavorites.Add(dto);
                await _context.SaveChangesAsync();
                return Ok(new { isFavorited = true });
            }
        }
    }
}
