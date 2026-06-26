namespace Celestia.Api.Models {
    using System;
    using System.Collections.Generic;

    public class Article {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string ThumbnailUrl { get; set; } = string.Empty;
        public int? AuthorId { get; set; }
        public User? Author { get; set; }
        public int? DestinationId { get; set; }
        public Destination? Destination { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<ArticleTag> ArticleTags { get; set; } = new List<ArticleTag>();
    }

    public class Tag {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public ICollection<ArticleTag> ArticleTags { get; set; } = new List<ArticleTag>();
    }

    public class ArticleTag {
        public int ArticleId { get; set; }
        public Article? Article { get; set; }
        public int TagId { get; set; }
        public Tag? Tag { get; set; }
    }

    public class MediaFile {
        public int Id { get; set; }
        public string Url { get; set; } = string.Empty;
        public string MediaType { get; set; } = "Image"; // Image, Video
        public int? DestinationId { get; set; }
        public Destination? Destination { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class Role {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    }

    public class UserRole {
        public int UserId { get; set; }
        public User? User { get; set; }
        public int RoleId { get; set; }
        public Role? Role { get; set; }
    }

    public class UserPoint {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public int Points { get; set; }
        public string Reason { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class Comment {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public int UserId { get; set; }
        public User? User { get; set; }
        public int ArticleId { get; set; }
        public Article? Article { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class UserFavorite {
        public int UserId { get; set; }
        public User? User { get; set; }
        public int DestinationId { get; set; }
        public Destination? Destination { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class UserInteraction {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public int DestinationId { get; set; }
        public Destination? Destination { get; set; }
        public string InteractionType { get; set; } = "View"; // View, Like, Book, Review
        public int Score { get; set; } = 1;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class SearchLog {
        public int Id { get; set; }
        public string Keyword { get; set; } = string.Empty;
        public int? UserId { get; set; }
        public User? User { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class TourPackage {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int DurationDays { get; set; }
        public int DestinationId { get; set; }
        public Destination? Destination { get; set; }
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }

    public class Booking {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public int TourPackageId { get; set; }
        public TourPackage? TourPackage { get; set; }
        public DateTime BookingDate { get; set; } = DateTime.UtcNow;
        public DateTime TravelDate { get; set; }
        public int NumberOfPeople { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = "Pending"; // Pending, Paid, Cancelled, Completed
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }

    public class Payment {
        public int Id { get; set; }
        public int BookingId { get; set; }
        public Booking? Booking { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; } = "VNPay";
        public string TransactionId { get; set; } = string.Empty;
        public string Status { get; set; } = "Success";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class Itinerary {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int UserId { get; set; }
        public User? User { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsPublic { get; set; } = false;
        public ICollection<ItineraryItem> ItineraryItems { get; set; } = new List<ItineraryItem>();
    }

    public class ItineraryItem {
        public int Id { get; set; }
        public int ItineraryId { get; set; }
        public Itinerary? Itinerary { get; set; }
        public int DestinationId { get; set; }
        public Destination? Destination { get; set; }
        public int? LocalServiceId { get; set; }
        public LocalService? LocalService { get; set; }
        public int DayNumber { get; set; }
        public string TimeStart { get; set; } = string.Empty;
    }

    public class SocialPost {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public string? MediaUrl { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public int? DestinationId { get; set; }
        public Destination? LinkedDestination { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int LikesCount { get; set; } = 0;
        public int CommentsCount { get; set; } = 0;
        public bool IsLookingForCompanion { get; set; } = false;
        public DateTime? TravelDate { get; set; }
    }

    public class SocialComment {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public int UserId { get; set; }
        public User? User { get; set; }
        public int SocialPostId { get; set; }
        public SocialPost? SocialPost { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
