using System.Collections.Generic;

namespace Celestia.Api.Models
{
    public class LandingPageConfig
    {
        public int Id { get; set; }
        public int DestinationId { get; set; }
        public Destination? Destination { get; set; }
        
        public string ThemeId { get; set; } = string.Empty;
        public LandingPageTheme? Theme { get; set; }
        
        public string CustomPrimaryColor { get; set; } = string.Empty;
        public string CustomSecondaryColor { get; set; } = string.Empty;
        public string CustomFontFamily { get; set; } = string.Empty;
        
        public string HeroTitle { get; set; } = string.Empty;
        public string HeroSubtitle { get; set; } = string.Empty;
        public string HeroImageUrl { get; set; } = string.Empty;
        public string HeroVideoUrl { get; set; } = string.Empty;
        
        public string SeoTitle { get; set; } = string.Empty;
        public string SeoDescription { get; set; } = string.Empty;
        
        public ICollection<LandingPageSection> Sections { get; set; } = new List<LandingPageSection>();
    }
}
