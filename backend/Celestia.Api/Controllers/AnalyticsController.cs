using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Celestia.Api.Data;
using Celestia.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Celestia.Api.Controllers
{
    [ApiController]
    [Route("api/analytics")]
    public class AnalyticsController : ControllerBase
    {
        private readonly CelestiaDbContext _context;

        public AnalyticsController(CelestiaDbContext context)
        {
            _context = context;
        }

        // GET: api/analytics/overview
        [HttpGet("overview")]
        public async Task<IActionResult> GetOverview()
        {
            var totalDestinations = await _context.Destinations.CountAsync();
            var totalViews = await _context.PageViews.CountAsync();
            var totalReviews = await _context.Reviews.CountAsync();
            
            double averageRating = 0;
            if (await _context.Destinations.AnyAsync())
            {
                averageRating = Math.Round(await _context.Destinations.AverageAsync(d => d.Rating), 1);
            }

            // Popular destinations
            var popularDestinations = await _context.Destinations
                .Select(d => new PopularDestinationStatDto
                {
                    Name = d.Name,
                    Views = d.PageViews.Count,
                    ReviewsCount = d.Reviews.Count,
                    Rating = d.Rating
                })
                .OrderByDescending(p => p.Views)
                .Take(5)
                .ToListAsync();

            // Daily views (past 30 days)
            var thirtyDaysAgo = DateTime.UtcNow.Date.AddDays(-30);
            var viewsData = await _context.PageViews
                .Where(pv => pv.Timestamp >= thirtyDaysAgo)
                .ToListAsync();

            var dailyViewsList = new List<DailyViewStatDto>();
            for (int i = 29; i >= 0; i--)
            {
                var targetDate = DateTime.UtcNow.Date.AddDays(-i);
                var formattedDate = targetDate.ToString("yyyy-MM-dd");
                var count = viewsData.Count(pv => pv.Timestamp.Date == targetDate);
                
                dailyViewsList.Add(new DailyViewStatDto
                {
                    Date = formattedDate,
                    Views = count
                });
            }

            // Device distribution
            var deviceCounts = await _context.PageViews
                .GroupBy(pv => pv.DeviceType)
                .Select(g => new DeviceStatDto
                {
                    Device = string.IsNullOrEmpty(g.Key) ? "desktop" : g.Key,
                    Count = g.Count()
                })
                .ToListAsync();

            // If some devices are missing, pad them
            var devices = new[] { "desktop", "mobile", "tablet" };
            foreach (var dev in devices)
            {
                if (!deviceCounts.Any(d => d.Device == dev))
                {
                    deviceCounts.Add(new DeviceStatDto { Device = dev, Count = 0 });
                }
            }

            // Region/Location distribution
            var regionCounts = await _context.PageViews
                .GroupBy(pv => pv.RegionName)
                .Select(g => new RegionStatDto
                {
                    Region = string.IsNullOrEmpty(g.Key) ? "Hà Nội" : g.Key,
                    Count = g.Count()
                })
                .OrderByDescending(r => r.Count)
                .Take(7)
                .ToListAsync();

            var overview = new AnalyticsOverviewDto
            {
                TotalDestinations = totalDestinations,
                TotalViews = totalViews,
                TotalReviews = totalReviews,
                AverageRating = averageRating,
                DailyViews = dailyViewsList,
                DeviceDistribution = deviceCounts,
                RegionDistribution = regionCounts,
                PopularDestinations = popularDestinations
            };

            return Ok(overview);
        }
    }
}
