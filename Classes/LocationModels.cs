using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Celestia.Classes
{
    public class Region : BaseEntity
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        public ICollection<Province> Provinces { get; set; } = new List<Province>();
    }

    public class Province : BaseEntity
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        
        public int RegionId { get; set; }
        public Region? Region { get; set; }

        public ICollection<Destination> Destinations { get; set; } = new List<Destination>();
    }

    public class DestinationCategory : BaseEntity
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        public ICollection<Destination> Destinations { get; set; } = new List<Destination>();
    }

    public class Destination : BaseEntity
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        
        public int ProvinceId { get; set; }
        public Province? Province { get; set; }

        public int CategoryId { get; set; }
        public DestinationCategory? Category { get; set; }

        public double Latitude { get; set; }
        public double Longitude { get; set; }
        
        public string CoverImageUrl { get; set; } = string.Empty;
        public List<string> GalleryUrls { get; set; } = new List<string>();
        public string VideoUrl { get; set; } = string.Empty;
        
        public double Rating { get; set; } = 0;
        public bool IsFeatured { get; set; } = false;
        public bool IsActive { get; set; } = true;

        public int? AuthorId { get; set; }
        public ApplicationUser? Author { get; set; }

        public ICollection<LocalService> LocalServices { get; set; } = new List<LocalService>();
    }

    public class LocalService : BaseEntity
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // Restaurant, Homestay...
        public string Description { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public List<string>? GalleryUrls { get; set; } = new List<string>();
        public double Rating { get; set; } = 0;
        
        public decimal Price { get; set; } = 0;
        public bool IsActive { get; set; } = true;
        public bool IsFeatured { get; set; } = false;
        
        public int DestinationId { get; set; }
        public Destination? Destination { get; set; }
    }
}
