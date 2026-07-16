using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Celestia.Classes
{
    public class LandingPageTheme : BaseEntity
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        
        public string PrimaryColor { get; set; } = string.Empty; // Hex
        public string SecondaryColor { get; set; } = string.Empty;
        public string BackgroundColor { get; set; } = string.Empty;
        public string FontFamily { get; set; } = string.Empty;
    }

    public class LandingPageConfig : BaseEntity
    {
        public int DestinationId { get; set; }
        public Destination? Destination { get; set; }
        
        public int ThemeId { get; set; }
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

    public class LandingPageSection : BaseEntity
    {
        public int LandingPageConfigId { get; set; }
        public LandingPageConfig? LandingPageConfig { get; set; }
        
        public string SectionType { get; set; } = string.Empty; // hero, intro, gallery, activities
        public string Title { get; set; } = string.Empty;
        public string Subtitle { get; set; } = string.Empty;
        public string ContentJson { get; set; } = "{}";
        public string HtmlRendered { get; set; } = string.Empty;
        public string CssRendered { get; set; } = string.Empty;
        public int SortOrder { get; set; }
    }
}
