using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Celestia.Api.Models
{
    public class Province
    {
        [Key]
        public string Id { get; set; } = string.Empty; // e.g., "hanoi", "quang-ninh"
        public string Name { get; set; } = string.Empty;
        public string RegionId { get; set; } = string.Empty;
        public Region? Region { get; set; }
        public ICollection<Destination> Destinations { get; set; } = new List<Destination>();
    }
}
