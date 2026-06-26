using System;
using System.ComponentModel.DataAnnotations;

namespace Celestia.Api.Models
{
    public class User
    {
        public int Id { get; set; }
        
        [Required]
        public string Username { get; set; } = string.Empty;
        
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        
        [Required]
        public string FullName { get; set; } = string.Empty;
        
        [Required]
        public string Email { get; set; } = string.Empty;
        
        public string Role { get; set; } = "Traveler"; // Admin, Editor, Traveler
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Extended Navigation Properties
        public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
        public ICollection<Article> Articles { get; set; } = new List<Article>();
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
        public ICollection<Itinerary> Itineraries { get; set; } = new List<Itinerary>();
        public ICollection<UserFavorite> UserFavorites { get; set; } = new List<UserFavorite>();
        public ICollection<UserPoint> UserPoints { get; set; } = new List<UserPoint>();
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public ICollection<UserInteraction> UserInteractions { get; set; } = new List<UserInteraction>();
        public ICollection<SearchLog> SearchLogs { get; set; } = new List<SearchLog>();
    }
}
