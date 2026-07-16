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
    public class LandingPageController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LandingPageController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/LandingPage/Themes
        [HttpGet("themes")]
        public async Task<ActionResult<IEnumerable<LandingPageTheme>>> GetThemes()
        {
            return await _context.LandingPageThemes.ToListAsync();
        }

        // GET: api/LandingPage/Destination/5
        [HttpGet("destination/{destinationId}")]
        public async Task<ActionResult<LandingPageConfig>> GetConfigForDestination(int destinationId)
        {
            var config = await _context.LandingPageConfigs
                .Include(c => c.Theme)
                .Include(c => c.Sections.OrderBy(s => s.SortOrder))
                .FirstOrDefaultAsync(c => c.DestinationId == destinationId);

            if (config == null)
            {
                return NotFound();
            }

            return config;
        }

        // PUT/POST: api/LandingPage/Destination/5
        [Authorize(Roles = "Admin,Editor")]
        [HttpPut("destination/{destinationId}")]
        public async Task<IActionResult> UpdateOrCreateConfig(int destinationId, LandingPageConfig config)
        {
            if (destinationId != config.DestinationId)
            {
                return BadRequest();
            }

            // Fix: Tự động gán Theme mặc định nếu Frontend không gửi lên (tránh lỗi khóa ngoại)
            if (config.ThemeId <= 0)
            {
                var defaultTheme = await _context.LandingPageThemes.FirstOrDefaultAsync(t => t.Slug == "default");
                if (defaultTheme == null)
                {
                    defaultTheme = new LandingPageTheme { Name = "Mặc định", Slug = "default" };
                    _context.LandingPageThemes.Add(defaultTheme);
                    await _context.SaveChangesAsync();
                }
                config.ThemeId = defaultTheme.Id;
            }

            var existingConfig = await _context.LandingPageConfigs
                .Include(c => c.Sections)
                .FirstOrDefaultAsync(c => c.DestinationId == destinationId);

            if (existingConfig == null)
            {
                _context.LandingPageConfigs.Add(config);
            }
            else
            {
                // Xóa các section cũ và thêm mới
                _context.LandingPageSections.RemoveRange(existingConfig.Sections);
                
                existingConfig.ThemeId = config.ThemeId;
                existingConfig.CustomPrimaryColor = config.CustomPrimaryColor;
                existingConfig.CustomSecondaryColor = config.CustomSecondaryColor;
                existingConfig.CustomFontFamily = config.CustomFontFamily;
                existingConfig.HeroTitle = config.HeroTitle;
                existingConfig.HeroSubtitle = config.HeroSubtitle;
                existingConfig.HeroImageUrl = config.HeroImageUrl;
                existingConfig.HeroVideoUrl = config.HeroVideoUrl;
                existingConfig.SeoTitle = config.SeoTitle;
                existingConfig.SeoDescription = config.SeoDescription;
                existingConfig.Sections = config.Sections; // Add new sections
                
                _context.Entry(existingConfig).State = EntityState.Modified;
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
