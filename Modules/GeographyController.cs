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
    public class GeographyController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GeographyController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("regions")]
        public async Task<ActionResult<IEnumerable<Region>>> GetRegions()
        {
            return await _context.Regions
                .Include(r => r.Provinces)
                .ToListAsync();
        }

        [HttpGet("provinces")]
        public async Task<ActionResult<IEnumerable<Province>>> GetProvinces()
        {
            return await _context.Provinces
                .Include(p => p.Region)
                .ToListAsync();
        }

        [HttpGet("regions/{regionId}/provinces")]
        public async Task<ActionResult<IEnumerable<Province>>> GetProvincesByRegion(int regionId)
        {
            return await _context.Provinces
                .Where(p => p.RegionId == regionId)
                .ToListAsync();
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("regions")]
        public async Task<ActionResult<Region>> CreateRegion(Region region)
        {
            _context.Regions.Add(region);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetRegions), new { id = region.Id }, region);
        }
    }
}
