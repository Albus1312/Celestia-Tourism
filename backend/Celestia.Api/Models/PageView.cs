using System;

namespace Celestia.Api.Models
{
    public class PageView
    {
        public int Id { get; set; }
        public int DestinationId { get; set; }
        public Destination? Destination { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public string IpAddress { get; set; } = string.Empty;
        public string UserAgent { get; set; } = string.Empty;
        public string DeviceType { get; set; } = string.Empty; // desktop, mobile, tablet
        public string RegionName { get; set; } = string.Empty; // Vietnam province/region or country
    }
}
