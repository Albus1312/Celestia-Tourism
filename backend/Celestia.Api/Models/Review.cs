using System;

namespace Celestia.Api.Models
{
    public class Review
    {
        public int Id { get; set; }
        public int DestinationId { get; set; }
        public Destination? Destination { get; set; }
        public string AuthorName { get; set; } = string.Empty;
        public int Rating { get; set; } // 1 to 5
        public string Comment { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
