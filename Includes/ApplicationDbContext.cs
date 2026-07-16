using Celestia.Classes;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Celestia.Includes
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, int>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // Location
        public DbSet<Region> Regions { get; set; }
        public DbSet<Province> Provinces { get; set; }
        public DbSet<DestinationCategory> DestinationCategories { get; set; }
        public DbSet<Destination> Destinations { get; set; }
        public DbSet<LocalService> LocalServices { get; set; }

        // Landing Page
        public DbSet<LandingPageTheme> LandingPageThemes { get; set; }
        public DbSet<LandingPageConfig> LandingPageConfigs { get; set; }
        public DbSet<LandingPageSection> LandingPageSections { get; set; }

        // Content
        public DbSet<Article> Articles { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<ArticleTag> ArticleTags { get; set; }
        public DbSet<MediaFile> MediaFiles { get; set; }
        public DbSet<Review> Reviews { get; set; }

        // Booking & Tours
        public DbSet<TourPackage> TourPackages { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Itinerary> Itineraries { get; set; }
        public DbSet<ItineraryItem> ItineraryItems { get; set; }

        // Social
        public DbSet<SocialPost> SocialPosts { get; set; }
        public DbSet<SocialComment> SocialComments { get; set; }
        public DbSet<SocialPostLike> SocialPostLikes { get; set; }
        public DbSet<Comment> Comments { get; set; }

        // Analytics
        public DbSet<PageView> PageViews { get; set; }
        public DbSet<SearchLog> SearchLogs { get; set; }
        public DbSet<UserInteraction> UserInteractions { get; set; }
        public DbSet<UserFavorite> UserFavorites { get; set; }
        public DbSet<UserPoint> UserPoints { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // ArticleTag N-N relationship
            builder.Entity<ArticleTag>()
                .HasKey(at => new { at.ArticleId, at.TagId });

            builder.Entity<ArticleTag>()
                .HasOne(at => at.Article)
                .WithMany(a => a.ArticleTags)
                .HasForeignKey(at => at.ArticleId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ArticleTag>()
                .HasOne(at => at.Tag)
                .WithMany(t => t.ArticleTags)
                .HasForeignKey(at => at.TagId)
                .OnDelete(DeleteBehavior.Cascade);

            // Soft Delete Global Query Filters
            builder.Entity<Region>().HasQueryFilter(x => !x.IsDeleted);
            builder.Entity<Province>().HasQueryFilter(x => !x.IsDeleted);
            builder.Entity<DestinationCategory>().HasQueryFilter(x => !x.IsDeleted);
            builder.Entity<Destination>().HasQueryFilter(x => !x.IsDeleted);
            builder.Entity<LocalService>().HasQueryFilter(x => !x.IsDeleted);
            builder.Entity<Article>().HasQueryFilter(x => !x.IsDeleted);
            builder.Entity<TourPackage>().HasQueryFilter(x => !x.IsDeleted);
            builder.Entity<Booking>().HasQueryFilter(x => !x.IsDeleted);

            // Avoid Cascade Delete Cycles
            builder.Entity<Destination>()
                .HasOne(d => d.Province)
                .WithMany(p => p.Destinations)
                .HasForeignKey(d => d.ProvinceId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Destination>()
                .HasOne(d => d.Category)
                .WithMany(c => c.Destinations)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Article>()
                .HasOne(a => a.Destination)
                .WithMany()
                .HasForeignKey(a => a.DestinationId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.Entity<SocialPost>()
                .HasOne(sp => sp.LinkedDestination)
                .WithMany()
                .HasForeignKey(sp => sp.DestinationId)
                .OnDelete(DeleteBehavior.SetNull);
                
            builder.Entity<LandingPageConfig>()
                .HasOne(l => l.Destination)
                .WithMany()
                .HasForeignKey(l => l.DestinationId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
