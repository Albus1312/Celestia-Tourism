using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Celestia.Api.Models
{
    public class LocalService
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(50)]
        public string Type { get; set; } = string.Empty; // "Restaurant", "Homestay", "Transport"
        
        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;
        
        [MaxLength(200)]
        public string Address { get; set; } = string.Empty;
        
        [MaxLength(50)]
        public string Phone { get; set; } = string.Empty;
        
        public string ImageUrl { get; set; } = string.Empty;
        
        [Range(0, 5)]
        public double Rating { get; set; } = 0;
        
        // Foreign Key to Destination
        public int DestinationId { get; set; }
        
        [ForeignKey("DestinationId")]
        public Destination? Destination { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
