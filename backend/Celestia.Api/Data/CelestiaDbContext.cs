using Microsoft.EntityFrameworkCore;
using Celestia.Api.Models;

namespace Celestia.Api.Data
{
    public class CelestiaDbContext : DbContext
    {
        public CelestiaDbContext(DbContextOptions<CelestiaDbContext> options) : base(options)
        {
        }

        public DbSet<Region> Regions => Set<Region>();
        public DbSet<Province> Provinces => Set<Province>();
        public DbSet<DestinationCategory> DestinationCategories => Set<DestinationCategory>();
        public DbSet<Destination> Destinations => Set<Destination>();
        public DbSet<LandingPageTheme> LandingPageThemes => Set<LandingPageTheme>();
        public DbSet<LandingPageConfig> LandingPageConfigs => Set<LandingPageConfig>();
        public DbSet<LandingPageSection> LandingPageSections => Set<LandingPageSection>();
        public DbSet<User> Users => Set<User>();
        public DbSet<UserSession> UserSessions => Set<UserSession>();
        public DbSet<PasswordResetToken> PasswordResetTokens => Set<PasswordResetToken>();
        public DbSet<Review> Reviews => Set<Review>();
        public DbSet<PageView> PageViews => Set<PageView>();
        public DbSet<LocalService> LocalServices => Set<LocalService>();

        // Extended Models DbSets
        public DbSet<Article> Articles => Set<Article>();
        public DbSet<Tag> Tags => Set<Tag>();
        public DbSet<ArticleTag> ArticleTags => Set<ArticleTag>();
        public DbSet<MediaFile> MediaFiles => Set<MediaFile>();
        public DbSet<Role> Roles => Set<Role>();
        public DbSet<UserRole> UserRoles => Set<UserRole>();
        public DbSet<UserPoint> UserPoints => Set<UserPoint>();
        public DbSet<Comment> Comments => Set<Comment>();
        public DbSet<UserFavorite> UserFavorites => Set<UserFavorite>();
        public DbSet<UserInteraction> UserInteractions => Set<UserInteraction>();
        public DbSet<SearchLog> SearchLogs => Set<SearchLog>();
        public DbSet<TourPackage> TourPackages => Set<TourPackage>();
        public DbSet<Booking> Bookings => Set<Booking>();
        public DbSet<Payment> Payments => Set<Payment>();
        public DbSet<Itinerary> Itineraries => Set<Itinerary>();
        public DbSet<ItineraryItem> ItineraryItems => Set<ItineraryItem>();
        public DbSet<SocialPost> SocialPosts => Set<SocialPost>();
        public DbSet<SocialComment> SocialComments => Set<SocialComment>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Existing configurations
            modelBuilder.Entity<UserSession>().HasOne(us => us.User).WithMany().HasForeignKey(us => us.UserId).OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<PasswordResetToken>().HasOne(prt => prt.User).WithMany().HasForeignKey(prt => prt.UserId).OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Province>().HasOne(p => p.Region).WithMany(r => r.Provinces).HasForeignKey(p => p.RegionId);
            modelBuilder.Entity<Destination>().HasOne(d => d.Province).WithMany(p => p.Destinations).HasForeignKey(d => d.ProvinceId);
            modelBuilder.Entity<LocalService>().HasOne(s => s.Destination).WithMany().HasForeignKey(s => s.DestinationId).OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Destination>().HasOne(d => d.Category).WithMany(c => c.Destinations).HasForeignKey(d => d.CategoryId);
            modelBuilder.Entity<LandingPageConfig>().HasOne(c => c.Destination).WithOne(d => d.LandingPageConfig).HasForeignKey<LandingPageConfig>(c => c.DestinationId);
            modelBuilder.Entity<LandingPageConfig>().HasOne(c => c.Theme).WithMany().HasForeignKey(c => c.ThemeId);
            modelBuilder.Entity<LandingPageSection>().HasOne(s => s.LandingPageConfig).WithMany(c => c.Sections).HasForeignKey(s => s.LandingPageConfigId);
            modelBuilder.Entity<Review>().HasOne(r => r.Destination).WithMany(d => d.Reviews).HasForeignKey(r => r.DestinationId);
            modelBuilder.Entity<PageView>().HasOne(p => p.Destination).WithMany(d => d.PageViews).HasForeignKey(p => p.DestinationId);

            // Extended Models configurations (Composite Keys)
            modelBuilder.Entity<ArticleTag>().HasKey(at => new { at.ArticleId, at.TagId });
            modelBuilder.Entity<ArticleTag>().HasOne(at => at.Article).WithMany(a => a.ArticleTags).HasForeignKey(at => at.ArticleId);
            modelBuilder.Entity<ArticleTag>().HasOne(at => at.Tag).WithMany(t => t.ArticleTags).HasForeignKey(at => at.TagId);

            modelBuilder.Entity<UserRole>().HasKey(ur => new { ur.UserId, ur.RoleId });
            modelBuilder.Entity<UserRole>().HasOne(ur => ur.User).WithMany(u => u.UserRoles).HasForeignKey(ur => ur.UserId);
            modelBuilder.Entity<UserRole>().HasOne(ur => ur.Role).WithMany(r => r.UserRoles).HasForeignKey(ur => ur.RoleId);

            modelBuilder.Entity<UserFavorite>().HasKey(uf => new { uf.UserId, uf.DestinationId });
            modelBuilder.Entity<UserFavorite>().HasOne(uf => uf.User).WithMany(u => u.UserFavorites).HasForeignKey(uf => uf.UserId);
            modelBuilder.Entity<UserFavorite>().HasOne(uf => uf.Destination).WithMany(d => d.UserFavorites).HasForeignKey(uf => uf.DestinationId);

            // Restrict cascade delete to prevent multiple cascade paths error (SQL Server limitation)
            modelBuilder.Entity<Article>().HasOne(a => a.Author).WithMany(u => u.Articles).HasForeignKey(a => a.AuthorId).OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Article>().HasOne(a => a.Destination).WithMany(d => d.Articles).HasForeignKey(a => a.DestinationId).OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Comment>().HasOne(c => c.User).WithMany(u => u.Comments).HasForeignKey(c => c.UserId).OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Comment>().HasOne(c => c.Article).WithMany().HasForeignKey(c => c.ArticleId).OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Booking>().HasOne(b => b.User).WithMany(u => u.Bookings).HasForeignKey(b => b.UserId).OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Booking>().HasOne(b => b.TourPackage).WithMany(t => t.Bookings).HasForeignKey(b => b.TourPackageId).OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<TourPackage>().HasOne(t => t.Destination).WithMany(d => d.TourPackages).HasForeignKey(t => t.DestinationId).OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<ItineraryItem>().HasOne(i => i.Destination).WithMany(d => d.ItineraryItems).HasForeignKey(i => i.DestinationId).OnDelete(DeleteBehavior.Restrict);

            // Social features restrictions
            modelBuilder.Entity<SocialPost>().HasOne(s => s.User).WithMany().HasForeignKey(s => s.UserId).OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<SocialPost>().HasOne(s => s.LinkedDestination).WithMany().HasForeignKey(s => s.DestinationId).OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<SocialComment>().HasOne(sc => sc.User).WithMany().HasForeignKey(sc => sc.UserId).OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<SocialComment>().HasOne(sc => sc.SocialPost).WithMany().HasForeignKey(sc => sc.SocialPostId).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
