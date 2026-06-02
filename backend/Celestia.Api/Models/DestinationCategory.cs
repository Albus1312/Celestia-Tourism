using System.Collections.Generic;

namespace Celestia.Api.Models
{
    public class DestinationCategory
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty; // e.g., "beach", "cultural", "mountain"
        public string Description { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
        public ICollection<Destination> Destinations { get; set; } = new List<Destination>();
    }
}
