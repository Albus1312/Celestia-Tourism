using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Celestia.Api.Models
{
    public class Region
    {
        [Key]
        public string Id { get; set; } = string.Empty; // e.g., "north", "central", "south"
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public ICollection<Province> Provinces { get; set; } = new List<Province>();
    }
}
