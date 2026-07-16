using System;
using System.ComponentModel.DataAnnotations;

namespace Celestia.Classes
{
    public class SocialPost : BaseEntity
    {
        [Required]
        public string Content { get; set; } = string.Empty;
        public string? MediaUrl { get; set; }
        
        public int UserId { get; set; }
        public ApplicationUser? User { get; set; }
        
        public int? DestinationId { get; set; }
        public Destination? LinkedDestination { get; set; }
        
        public int LikesCount { get; set; } = 0;
        public int CommentsCount { get; set; } = 0;
        
        public bool IsLookingForCompanion { get; set; } = false;
        public DateTime? TravelDate { get; set; }
    }

    public class SocialComment : BaseEntity
    {
        [Required]
        public string Content { get; set; } = string.Empty;
        
        public int UserId { get; set; }
        public ApplicationUser? User { get; set; }
        
        public int SocialPostId { get; set; }
        public SocialPost? SocialPost { get; set; }
    }

    public class Comment : BaseEntity
    {
        [Required]
        public string Content { get; set; } = string.Empty;
        
        public int UserId { get; set; }
        public ApplicationUser? User { get; set; }
        
        public int ArticleId { get; set; }
        public Article? Article { get; set; }

        public bool IsApproved { get; set; } = true;
        public int ReportCount { get; set; } = 0;
    }

    public class SocialPostLike
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public ApplicationUser? User { get; set; }
        public int SocialPostId { get; set; }
        public SocialPost? SocialPost { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
