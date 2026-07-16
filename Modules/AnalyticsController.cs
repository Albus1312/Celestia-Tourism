using Celestia.Classes;
using Celestia.Includes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Celestia.Modules
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,Editor")] // Cả Admin và Editor đều được xem Thống kê chung
    public class AnalyticsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AnalyticsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Analytics/Dashboard
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboardMetrics([FromQuery] string timeFilter = "6months")
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole("Admin");

            int? currentUserId = null;
            if (int.TryParse(userIdStr, out int parsedId))
            {
                currentUserId = parsedId;
            }

            IQueryable<ApplicationUser> usersQuery = _context.Users.Where(u => !u.IsDeleted);
            IQueryable<Destination> destinationsQuery = _context.Destinations.Where(d => !d.IsDeleted);
            IQueryable<TourPackage> toursQuery = _context.TourPackages.Where(t => !t.IsDeleted);
            IQueryable<LocalService> servicesQuery = _context.LocalServices.Where(s => !s.IsDeleted);
            IQueryable<Article> articlesQuery = _context.Articles.Where(a => !a.IsDeleted);
            IQueryable<SocialPost> postsQuery = _context.SocialPosts;
            IQueryable<PageView> pageViewsQuery = _context.PageViews;

            var totalUsers = await usersQuery.CountAsync();
            var totalDestinations = await destinationsQuery.CountAsync();
            var totalTours = await toursQuery.CountAsync();
            var totalServices = await servicesQuery.CountAsync();
            var totalArticles = await articlesQuery.CountAsync();
            var totalPosts = await postsQuery.CountAsync();
            var totalPageViews = await pageViewsQuery.CountAsync();

            var topDestinationsData = await pageViewsQuery
                .Where(pv => pv.DestinationId.HasValue && _context.Destinations.Any(d => d.Id == pv.DestinationId && !d.IsDeleted && d.IsActive))
                .GroupBy(pv => pv.DestinationId.Value)
                .Select(g => new { DestinationId = g.Key, Views = g.Count() })
                .OrderByDescending(x => x.Views)
                .Take(5)
                .ToListAsync();

            var destIds = topDestinationsData.Select(x => x.DestinationId).ToList();
            var destNames = await _context.Destinations.Where(d => destIds.Contains(d.Id)).ToDictionaryAsync(d => d.Id, d => d.Name);

            var topDestinations = topDestinationsData.Select(x => new {
                Name = destNames.ContainsKey(x.DestinationId) ? destNames[x.DestinationId] : $"Địa điểm ID: {x.DestinationId}",
                Value = x.Views
            }).ToList();

            var topToursData = await pageViewsQuery
                .Where(pv => pv.TourPackageId.HasValue && _context.TourPackages.Any(t => t.Id == pv.TourPackageId && !t.IsDeleted))
                .GroupBy(pv => pv.TourPackageId.Value)
                .Select(g => new { TourId = g.Key, Views = g.Count() })
                .OrderByDescending(x => x.Views)
                .Take(5)
                .ToListAsync();
            var tourIds = topToursData.Select(x => x.TourId).ToList();
            var tourNames = await _context.TourPackages.Where(t => tourIds.Contains(t.Id)).ToDictionaryAsync(t => t.Id, t => t.Name);
            var topTours = topToursData.Select(x => new {
                Name = tourNames.ContainsKey(x.TourId) ? tourNames[x.TourId] : $"Tour ID: {x.TourId}",
                Value = x.Views
            }).ToList();

            var topServicesData = await pageViewsQuery
                .Where(pv => pv.LocalServiceId.HasValue && _context.LocalServices.Any(s => s.Id == pv.LocalServiceId && !s.IsDeleted && s.IsActive))
                .GroupBy(pv => pv.LocalServiceId.Value)
                .Select(g => new { ServiceId = g.Key, Views = g.Count() })
                .OrderByDescending(x => x.Views)
                .Take(5)
                .ToListAsync();
            var serviceIds = topServicesData.Select(x => x.ServiceId).ToList();
            var serviceNames = await _context.LocalServices.Where(s => serviceIds.Contains(s.Id)).ToDictionaryAsync(s => s.Id, s => s.Name);
            var topServices = topServicesData.Select(x => new {
                Name = serviceNames.ContainsKey(x.ServiceId) ? serviceNames[x.ServiceId] : $"Dịch vụ ID: {x.ServiceId}",
                Value = x.Views
            }).ToList();

            var topArticlesData = await pageViewsQuery
                .Where(pv => pv.ArticleId.HasValue && _context.Articles.Any(a => a.Id == pv.ArticleId && !a.IsDeleted))
                .GroupBy(pv => pv.ArticleId.Value)
                .Select(g => new { ArticleId = g.Key, Views = g.Count() })
                .OrderByDescending(x => x.Views)
                .Take(5)
                .ToListAsync();
            var articleIds = topArticlesData.Select(x => x.ArticleId).ToList();
            var articleNames = await _context.Articles.Where(a => articleIds.Contains(a.Id)).ToDictionaryAsync(a => a.Id, a => a.Title);
            var topArticles = topArticlesData.Select(x => new {
                Name = articleNames.ContainsKey(x.ArticleId) ? articleNames[x.ArticleId] : $"Bài viết ID: {x.ArticleId}",
                Value = x.Views
            }).ToList();

            // Chart Views (Dynamic based on timeFilter)
            var chartViews = new System.Collections.Generic.List<object>();
            var now = System.DateTime.UtcNow;

            if (timeFilter == "30days" || timeFilter == "7days")
            {
                int days = timeFilter == "30days" ? 30 : 7;
                var startDate = now.AddDays(-days + 1).Date;
                var viewsData = await pageViewsQuery
                    .Where(p => p.Timestamp >= startDate)
                    .GroupBy(p => p.Timestamp.Date)
                    .Select(g => new { Date = g.Key, Views = g.Count() })
                    .ToListAsync();
                
                for (int i = days - 1; i >= 0; i--)
                {
                    var targetDate = now.AddDays(-i).Date;
                    var data = viewsData.FirstOrDefault(v => v.Date == targetDate);
                    chartViews.Add(new {
                        name = targetDate.ToString("dd/MM"),
                        views = data?.Views ?? 0
                    });
                }
            }
            else // default 6months
            {
                var sixMonthsAgo = now.AddMonths(-5);
                sixMonthsAgo = new System.DateTime(sixMonthsAgo.Year, sixMonthsAgo.Month, 1, 0, 0, 0, System.DateTimeKind.Utc);
                
                var monthlyViewsData = await pageViewsQuery
                    .Where(p => p.Timestamp >= sixMonthsAgo)
                    .GroupBy(p => new { p.Timestamp.Year, p.Timestamp.Month })
                    .Select(g => new { Year = g.Key.Year, Month = g.Key.Month, Views = g.Count() })
                    .ToListAsync();

                for (int i = 5; i >= 0; i--)
                {
                    var targetMonth = now.AddMonths(-i);
                    var data = monthlyViewsData.FirstOrDefault(m => m.Year == targetMonth.Year && m.Month == targetMonth.Month);
                    chartViews.Add(new {
                        name = $"T{targetMonth.Month}",
                        views = data?.Views ?? 0
                    });
                }
            }

            return Ok(new
            {
                Metrics = new {
                    TotalUsers = totalUsers,
                    TotalDestinations = totalDestinations,
                    TotalTours = totalTours,
                    TotalServices = totalServices,
                    TotalArticles = totalArticles,
                    TotalPosts = totalPosts,
                    TotalPageViews = totalPageViews
                },
                TopDestinations = topDestinations,
                TopTours = topTours,
                TopServices = topServices,
                TopArticles = topArticles,
                ChartViews = chartViews
            });
        }

        public class PageViewRequest
        {
            public int? DestinationId { get; set; }
            public int? TourPackageId { get; set; }
            public int? LocalServiceId { get; set; }
            public int? ArticleId { get; set; }
            public string UserAgent { get; set; } = string.Empty;
            public string DeviceType { get; set; } = "desktop";
        }

        [AllowAnonymous]
        [HttpPost("log-view")]
        public async Task<IActionResult> LogPageView([FromBody] PageViewRequest request)
        {
            var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
            
            var view = new PageView
            {
                DestinationId = request.DestinationId,
                TourPackageId = request.TourPackageId,
                LocalServiceId = request.LocalServiceId,
                ArticleId = request.ArticleId,
                Timestamp = System.DateTime.UtcNow,
                IpAddress = ip,
                UserAgent = request.UserAgent,
                DeviceType = request.DeviceType
            };

            _context.PageViews.Add(view);
            await _context.SaveChangesAsync();

            return Ok(new { success = true });
        }
    }
}
