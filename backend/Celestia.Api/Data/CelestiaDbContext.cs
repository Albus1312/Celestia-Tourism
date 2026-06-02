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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure User-UserSession relationship
            modelBuilder.Entity<UserSession>()
                .HasOne(us => us.User)
                .WithMany()
                .HasForeignKey(us => us.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure User-PasswordResetToken relationship
            modelBuilder.Entity<PasswordResetToken>()
                .HasOne(prt => prt.User)
                .WithMany()
                .HasForeignKey(prt => prt.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure Region-Province relationship
            modelBuilder.Entity<Province>()
                .HasOne(p => p.Region)
                .WithMany(r => r.Provinces)
                .HasForeignKey(p => p.RegionId);

            // Configure Province-Destination relationship
            modelBuilder.Entity<Destination>()
                .HasOne(d => d.Province)
                .WithMany(p => p.Destinations)
                .HasForeignKey(d => d.ProvinceId);

            // Configure Category-Destination relationship
            modelBuilder.Entity<Destination>()
                .HasOne(d => d.Category)
                .WithMany(c => c.Destinations)
                .HasForeignKey(d => d.CategoryId);

            // Configure Destination-LandingPageConfig relationship
            modelBuilder.Entity<LandingPageConfig>()
                .HasOne(c => c.Destination)
                .WithOne(d => d.LandingPageConfig)
                .HasForeignKey<LandingPageConfig>(c => c.DestinationId);

            // Configure Theme-LandingPageConfig relationship
            modelBuilder.Entity<LandingPageConfig>()
                .HasOne(c => c.Theme)
                .WithMany()
                .HasForeignKey(c => c.ThemeId);

            // Configure Section-LandingPageConfig relationship
            modelBuilder.Entity<LandingPageSection>()
                .HasOne(s => s.LandingPageConfig)
                .WithMany(c => c.Sections)
                .HasForeignKey(s => s.LandingPageConfigId);

            // Configure Review-Destination relationship
            modelBuilder.Entity<Review>()
                .HasOne(r => r.Destination)
                .WithMany(d => d.Reviews)
                .HasForeignKey(r => r.DestinationId);

            // Configure PageView-Destination relationship
            modelBuilder.Entity<PageView>()
                .HasOne(p => p.Destination)
                .WithMany(d => d.PageViews)
                .HasForeignKey(p => p.DestinationId);
        }
    }
}
