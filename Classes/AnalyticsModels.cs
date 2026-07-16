using System;
using System.ComponentModel.DataAnnotations;

namespace Celestia.Classes
{
    public class PageView : BaseEntity
    {
        public int? DestinationId { get; set; }
        public Destination? Destination { get; set; }

        public int? TourPackageId { get; set; }
        public TourPackage? TourPackage { get; set; }

        public int? LocalServiceId { get; set; }
        public LocalService? LocalService { get; set; }

        public int? ArticleId { get; set; }
        public Article? Article { get; set; }
        
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public string IpAddress { get; set; } = string.Empty;
        public string UserAgent { get; set; } = string.Empty;
        public string DeviceType { get; set; } = string.Empty; // desktop, mobile, tablet
        public string RegionName { get; set; } = string.Empty;
    }

    public class SearchLog : BaseEntity
    {
        [Required]
        public string Keyword { get; set; } = string.Empty;
        
        public int? UserId { get; set; }
    }

    public class UserInteraction : BaseEntity
    {
        public int UserId { get; set; }
        
        public int DestinationId { get; set; }
        public Destination? Destination { get; set; }
        
        public InteractionType InteractionType { get; set; } = InteractionType.View; // Enum
        public int Score { get; set; } = 1;
    }

    public class UserFavorite : BaseEntity
    {
        public int UserId { get; set; }
        
        public int DestinationId { get; set; }
        public Destination? Destination { get; set; }
    }

    public class UserPoint : BaseEntity
    {
        public int UserId { get; set; }
        
        public int Points { get; set; }
        public string Reason { get; set; } = string.Empty;
    }
}
