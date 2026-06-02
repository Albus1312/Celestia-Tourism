namespace Celestia.Api.Models
{
    public class LandingPageSection
    {
        public int Id { get; set; }
        public int LandingPageConfigId { get; set; }
        public LandingPageConfig? LandingPageConfig { get; set; }
        
        public string SectionType { get; set; } = string.Empty; // e.g., "hero", "intro", "gallery", "activities", "reviews", "cta"
        public string Title { get; set; } = string.Empty;
        public string Subtitle { get; set; } = string.Empty;
        
        // Stored as JSON string
        public string ContentJson { get; set; } = "{}";
        public int SortOrder { get; set; }
    }
}
