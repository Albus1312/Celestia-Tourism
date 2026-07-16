using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Celestia.Classes
{
    // Cần phải comment out User class hoặc tạo giả định vì sẽ dùng IdentityUser sau này
    public class UserPlaceholder : BaseEntity 
    {
        public string FullName { get; set; } = string.Empty;
    }

    public class Article : BaseEntity
    {
        [Required]
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Excerpt { get; set; } = string.Empty;
        public string ContentJson { get; set; } = "{}"; // Visual Page Builder Data
        public string ThumbnailUrl { get; set; } = string.Empty;
        
        public int AuthorId { get; set; } // FK to User
        
        public int? DestinationId { get; set; }
        public Destination? Destination { get; set; }

        public ICollection<ArticleTag> ArticleTags { get; set; } = new List<ArticleTag>();
    }

    public class Tag : BaseEntity
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;

        public ICollection<ArticleTag> ArticleTags { get; set; } = new List<ArticleTag>();
    }

    public class ArticleTag
    {
        public int ArticleId { get; set; }
        public Article? Article { get; set; }
        
        public int TagId { get; set; }
        public Tag? Tag { get; set; }
    }

    public class MediaFile : BaseEntity
    {
        [Required]
        public string Url { get; set; } = string.Empty;
        public MediaType Type { get; set; } = MediaType.Image; // Enum
        
        public int? DestinationId { get; set; }
        public Destination? Destination { get; set; }
    }

    public class Review : BaseEntity
    {
        public int? DestinationId { get; set; }
        public Destination? Destination { get; set; }
        
        public int? TourPackageId { get; set; }
        public TourPackage? TourPackage { get; set; }
        
        public int? LocalServiceId { get; set; }
        public LocalService? LocalService { get; set; }

        public int UserId { get; set; }
        public ApplicationUser? User { get; set; }
        
        public int Rating { get; set; } // 1-5
        public string Comment { get; set; } = string.Empty;
        
        public bool IsApproved { get; set; } = true;
        public int ReportCount { get; set; } = 0;
    }
}
