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
    [Route("api/tours")]
    public class TourPackagesController : ControllerBase
    {
        private readonly CelestiaDbContext _context;

        public TourPackagesController(CelestiaDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTours()
        {
            var tours = await _context.TourPackages
                .Include(t => t.Destination)
                .OrderByDescending(t => t.Id)
                .Select(t => new
                {
                    t.Id,
                    t.Name,
                    t.Description,
                    t.Price,
                    t.DurationDays,
                    DestinationName = t.Destination != null ? t.Destination.Name : "Unknown",
                    t.DestinationId
                })
                .ToListAsync();

            return Ok(tours);
        }

        [HttpGet("destination/{destinationId}")]
        public async Task<IActionResult> GetToursByDestination(int destinationId)
        {
            var tours = await _context.TourPackages
                .Where(t => t.DestinationId == destinationId)
                .OrderBy(t => t.Price)
                .ToListAsync();

            return Ok(tours);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTour([FromBody] TourPackage dto)
        {
            if (string.IsNullOrEmpty(dto.Name) || dto.Price <= 0)
                return BadRequest("Invalid tour data.");

            _context.TourPackages.Add(dto);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAllTours), new { id = dto.Id }, dto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTour(int id)
        {
            var tour = await _context.TourPackages.FindAsync(id);
            if (tour == null) return NotFound();

            _context.TourPackages.Remove(tour);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
