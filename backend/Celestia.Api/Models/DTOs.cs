using System;
using System.Collections.Generic;

namespace Celestia.Api.Models
{
    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginResponse
    {
        public string Token { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }

    public class RegisterRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }

    public class DestinationSummaryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string ProvinceId { get; set; } = string.Empty;
        public string ProvinceName { get; set; } = string.Empty;
        public string RegionId { get; set; } = string.Empty;
        public string CategorySlug { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public double Rating { get; set; }
        public string ThumbnailUrl { get; set; } = string.Empty;
        public string ThemeId { get; set; } = string.Empty;
    }

    public class PageBuilderPreviewDto
    {
        public int DestinationId { get; set; }
        public string ThemeId { get; set; } = string.Empty;
        public string HeroTitle { get; set; } = string.Empty;
        public string HeroSubtitle { get; set; } = string.Empty;
        public string HeroImageUrl { get; set; } = string.Empty;
        public string HeroVideoUrl { get; set; } = string.Empty;
        public string CustomPrimaryColor { get; set; } = string.Empty;
        public string CustomSecondaryColor { get; set; } = string.Empty;
        public string CustomFontFamily { get; set; } = string.Empty;
        public List<LandingPageSectionDto> Sections { get; set; } = new();
    }

    public class LandingPageSectionDto
    {
        public int Id { get; set; }
        public string SectionType { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Subtitle { get; set; } = string.Empty;
        public string ContentJson { get; set; } = "{}";
        public int SortOrder { get; set; }
    }

    public class UpdateLandingPageConfigDto
    {
        public string ThemeId { get; set; } = string.Empty;
        public string HeroTitle { get; set; } = string.Empty;
        public string HeroSubtitle { get; set; } = string.Empty;
        public string HeroImageUrl { get; set; } = string.Empty;
        public string HeroVideoUrl { get; set; } = string.Empty;
        public string CustomPrimaryColor { get; set; } = string.Empty;
        public string CustomSecondaryColor { get; set; } = string.Empty;
        public string CustomFontFamily { get; set; } = string.Empty;
        public List<UpdateSectionDto> Sections { get; set; } = new();
    }

    public class UpdateSectionDto
    {
        public int Id { get; set; } // 0 if new section
        public string SectionType { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Subtitle { get; set; } = string.Empty;
        public string ContentJson { get; set; } = "{}";
        public int SortOrder { get; set; }
    }

    public class CreateReviewDto
    {
        public string AuthorName { get; set; } = string.Empty;
        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
    }

    public class AnalyticsOverviewDto
    {
        public int TotalDestinations { get; set; }
        public int TotalViews { get; set; }
        public int TotalReviews { get; set; }
        public double AverageRating { get; set; }
        public List<DailyViewStatDto> DailyViews { get; set; } = new();
        public List<DeviceStatDto> DeviceDistribution { get; set; } = new();
        public List<RegionStatDto> RegionDistribution { get; set; } = new();
        public List<PopularDestinationStatDto> PopularDestinations { get; set; } = new();
    }

    public class DailyViewStatDto
    {
        public string Date { get; set; } = string.Empty;
        public int Views { get; set; }
    }

    public class DeviceStatDto
    {
        public string Device { get; set; } = string.Empty;
        public int Count { get; set; }
    }

    public class RegionStatDto
    {
        public string Region { get; set; } = string.Empty;
        public int Count { get; set; }
    }

    public class PopularDestinationStatDto
    {
        public string Name { get; set; } = string.Empty;
        public int Views { get; set; }
        public int ReviewsCount { get; set; }
        public double Rating { get; set; }
    }

    public class CreateDestinationDto
    {
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string DetailedDescription { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string ProvinceId { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public string ThumbnailUrl { get; set; } = string.Empty;
        public string CoverUrl { get; set; } = string.Empty;
    }

    public class UpdateDestinationDto : CreateDestinationDto
    {
    }

    public class LocalServiceDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public double Rating { get; set; }
        public int DestinationId { get; set; }
    }

    public class CreateLocalServiceDto
    {
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public double Rating { get; set; }
        public int DestinationId { get; set; }
    }
}
