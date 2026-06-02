using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Celestia.Api.Data;
using Celestia.Api.Models;
using System.Linq;
using System.Threading.Tasks;

namespace Celestia.Api.Controllers
{
    [ApiController]
    [Route("api/landingpage")]
    public class LandingPageController : ControllerBase
    {
        private readonly CelestiaDbContext _context;

        public LandingPageController(CelestiaDbContext context)
        {
            _context = context;
        }

        // GET: api/landingpage/{destinationId}
        [HttpGet("{destinationId}")]
        public async Task<IActionResult> GetConfig(int destinationId)
        {
            var config = await _context.LandingPageConfigs
                .Include(c => c.Theme)
                .Include(c => c.Sections)
                .FirstOrDefaultAsync(c => c.DestinationId == destinationId);

            if (config == null)
            {
                // Create a default config if none exists to avoid errors and support auto-customization
                var destination = await _context.Destinations.FindAsync(destinationId);
                if (destination == null)
                {
                    return NotFound(new { message = "Không tìm thấy địa điểm du lịch!" });
                }

                config = new LandingPageConfig
                {
                    DestinationId = destinationId,
                    ThemeId = "ocean-breeze",
                    HeroTitle = destination.Name,
                    HeroSubtitle = destination.Description,
                    HeroImageUrl = destination.CoverUrl,
                    SeoTitle = $"{destination.Name} - Khám phá ngay",
                    SeoDescription = destination.Description
                };
                
                _context.LandingPageConfigs.Add(config);
                await _context.SaveChangesAsync();

                // Add default intro section
                var defaultSection = new LandingPageSection
                {
                    LandingPageConfigId = config.Id,
                    SectionType = "intro",
                    Title = "Khám phá vẻ đẹp kỳ vĩ",
                    Subtitle = "Trải nghiệm đặc trưng",
                    SortOrder = 1,
                    ContentJson = "{\"paragraphs\":[\"" + destination.DetailedDescription + "\"],\"stats\":[]}"
                };
                _context.LandingPageSections.Add(defaultSection);
                await _context.SaveChangesAsync();
                
                // Re-fetch
                config = await _context.LandingPageConfigs
                    .Include(c => c.Theme)
                    .Include(c => c.Sections)
                    .FirstAsync(c => c.DestinationId == destinationId);
            }

            var result = new PageBuilderPreviewDto
            {
                DestinationId = config.DestinationId,
                ThemeId = config.ThemeId,
                HeroTitle = config.HeroTitle,
                HeroSubtitle = config.HeroSubtitle,
                HeroImageUrl = config.HeroImageUrl,
                HeroVideoUrl = config.HeroVideoUrl,
                CustomPrimaryColor = config.CustomPrimaryColor,
                CustomSecondaryColor = config.CustomSecondaryColor,
                CustomFontFamily = config.CustomFontFamily,
                Sections = config.Sections.OrderBy(s => s.SortOrder).Select(s => new LandingPageSectionDto
                {
                    Id = s.Id,
                    SectionType = s.SectionType,
                    Title = s.Title,
                    Subtitle = s.Subtitle,
                    ContentJson = s.ContentJson,
                    SortOrder = s.SortOrder
                }).ToList()
            };

            return Ok(result);
        }

        // POST: api/landingpage/{destinationId}
        [HttpPost("{destinationId}")]
        public async Task<IActionResult> SaveConfig(int destinationId, [FromBody] UpdateLandingPageConfigDto dto)
        {
            if (dto == null)
            {
                return BadRequest(new { message = "Dữ liệu cấu hình không hợp lệ." });
            }

            var config = await _context.LandingPageConfigs
                .Include(c => c.Sections)
                .FirstOrDefaultAsync(c => c.DestinationId == destinationId);

            if (config == null)
            {
                config = new LandingPageConfig { DestinationId = destinationId };
                _context.LandingPageConfigs.Add(config);
                await _context.SaveChangesAsync();
            }

            // Verify theme exists
            var themeExists = await _context.LandingPageThemes.AnyAsync(t => t.Id == dto.ThemeId);
            if (themeExists)
            {
                config.ThemeId = dto.ThemeId;
            }

            config.HeroTitle = dto.HeroTitle;
            config.HeroSubtitle = dto.HeroSubtitle;
            config.HeroImageUrl = dto.HeroImageUrl;
            config.HeroVideoUrl = dto.HeroVideoUrl;
            config.CustomPrimaryColor = dto.CustomPrimaryColor;
            config.CustomSecondaryColor = dto.CustomSecondaryColor;
            config.CustomFontFamily = dto.CustomFontFamily;

            // Clear old sections and rebuild based on incoming edited order/content
            _context.LandingPageSections.RemoveRange(config.Sections);
            
            int order = 1;
            foreach (var secDto in dto.Sections.OrderBy(s => s.SortOrder))
            {
                _context.LandingPageSections.Add(new LandingPageSection
                {
                    LandingPageConfigId = config.Id,
                    SectionType = secDto.SectionType,
                    Title = secDto.Title,
                    Subtitle = secDto.Subtitle,
                    ContentJson = secDto.ContentJson,
                    SortOrder = order++
                });
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Lưu cấu hình trang landing page thành công!", destinationId });
        }

        // GET: api/landingpage/themes
        [HttpGet("themes")]
        public async Task<IActionResult> GetThemes()
        {
            var themes = await _context.LandingPageThemes.ToListAsync();
            return Ok(themes);
        }
    }
}
