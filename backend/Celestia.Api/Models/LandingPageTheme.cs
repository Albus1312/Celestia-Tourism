using System.ComponentModel.DataAnnotations;

namespace Celestia.Api.Models
{
    public class LandingPageTheme
    {
        [Key]
        public string Id { get; set; } = string.Empty; // e.g., "ocean-breeze", "heritage-gold", "mountain-mist"
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string PrimaryColor { get; set; } = string.Empty; // Hex or HSL
        public string SecondaryColor { get; set; } = string.Empty;
        public string BackgroundColor { get; set; } = string.Empty;
        public string FontFamily { get; set; } = string.Empty;
    }
}
