using System;
using System.ComponentModel.DataAnnotations;

namespace Celestia.Classes
{
    public class TourPackage : BaseEntity
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int DurationDays { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public List<string>? GalleryUrls { get; set; } = new List<string>();
        public bool IsFeatured { get; set; } = false;
        
        public int DestinationId { get; set; }
        public Destination? Destination { get; set; }

        public int? AuthorId { get; set; }
        public ApplicationUser? Author { get; set; }
    }

    public class Booking : BaseEntity
    {
        public int UserId { get; set; }
        public ApplicationUser? User { get; set; }
        
        public int? TourPackageId { get; set; }
        public TourPackage? TourPackage { get; set; }
        
        public int? LocalServiceId { get; set; }
        public LocalService? LocalService { get; set; }
        
        public DateTime BookingDate { get; set; } = DateTime.UtcNow;
        public DateTime TravelDate { get; set; }
        public int NumberOfPeople { get; set; }
        public decimal TotalAmount { get; set; }
        
        public BookingStatus Status { get; set; } = BookingStatus.Pending; // Enum
    }

    public class Payment : BaseEntity
    {
        public int BookingId { get; set; }
        public Booking? Booking { get; set; }
        
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; } = "VNPay";
        public string TransactionId { get; set; } = string.Empty;
        public PaymentStatus Status { get; set; } = PaymentStatus.Pending; // Enum
    }

    public class Itinerary : BaseEntity
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        
        public int UserId { get; set; }
        
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsPublic { get; set; } = false;
    }

    public class ItineraryItem : BaseEntity
    {
        public int ItineraryId { get; set; }
        public Itinerary? Itinerary { get; set; }
        
        public int? DestinationId { get; set; }
        public Destination? Destination { get; set; }
        
        public int? LocalServiceId { get; set; }
        public LocalService? LocalService { get; set; }
        
        public int DayNumber { get; set; }
        public string TimeStart { get; set; } = string.Empty; // e.g. "08:00 AM"
    }
}
