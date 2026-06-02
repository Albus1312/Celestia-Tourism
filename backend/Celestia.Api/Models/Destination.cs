using System;
using System.Collections.Generic;

namespace Celestia.Api.Models
{
    public class Destination
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string DetailedDescription { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        
        public string ProvinceId { get; set; } = string.Empty;
        public Province? Province { get; set; }
        
        public int CategoryId { get; set; }
        public DestinationCategory? Category { get; set; }
        
        public double Rating { get; set; }
        public string ThumbnailUrl { get; set; } = string.Empty;
        public string CoverUrl { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public LandingPageConfig? LandingPageConfig { get; set; }
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
        public ICollection<PageView> PageViews { get; set; } = new List<PageView>();
    }
}
