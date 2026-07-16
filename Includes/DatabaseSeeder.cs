using Celestia.Classes;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Celestia.Includes
{
    public static class DatabaseSeeder
    {
        public static async Task SeedAsync(ApplicationDbContext context, UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager)
        {
            // 1. Seed Roles
            var roles = new[] { "Admin", "Editor", "Traveler" };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new ApplicationRole { Name = role, Description = $"System {role} role" });
                }
            }

            // 2. Seed Default Users (Admin, Editor, Traveler)
            var users = new List<(string email, string name, string role)>
            {
                ("admin@celestia.vn", "System Administrator", "Admin"),
                ("editor@celestia.vn", "Content Editor", "Editor"),
                ("traveler@celestia.vn", "Happy Traveler", "Traveler")
            };

            foreach (var u in users)
            {
                if (await userManager.FindByEmailAsync(u.email) == null)
                {
                    var newUser = new ApplicationUser
                    {
                        UserName = u.email,
                        Email = u.email,
                        FullName = u.name,
                        EmailConfirmed = true
                    };

                    var result = await userManager.CreateAsync(newUser, "Admin@123");
                    if (result.Succeeded)
                    {
                        await userManager.AddToRoleAsync(newUser, u.role);
                    }
                }
            }

            // 3. Seed Regions
            if (!context.Regions.Any())
            {
                var regions = new List<Region>
                {
                    new Region { Name = "Miền Bắc", Slug = "mien-bac", Description = "Vùng văn hóa lịch sử lâu đời." },
                    new Region { Name = "Miền Trung", Slug = "mien-trung", Description = "Nơi hội tụ những bãi biển tuyệt đẹp." },
                    new Region { Name = "Miền Nam", Slug = "mien-nam", Description = "Vùng đất sông nước nhộn nhịp." }
                };
                await context.Regions.AddRangeAsync(regions);
                await context.SaveChangesAsync();
            }

            // 4. Kiểm tra và cập nhật 34 Tỉnh Thành mới
            var oldNames = new[] { "Sông Bé", "Hà Tuyên", "Bắc Kạn", "Thừa Thiên Huế", "Bà Rịa - Vũng Tàu", "Hải Phòng" };
            bool needsUpdate = context.Provinces.Count() == 34 && context.Provinces.Any(p => oldNames.Contains(p.Name));
            bool isEmpty = !context.Provinces.Any();

            if (needsUpdate || isEmpty)
            {
                var north = await context.Regions.FirstAsync(r => r.Slug == "mien-bac");
                var central = await context.Regions.FirstAsync(r => r.Slug == "mien-trung");
                var south = await context.Regions.FirstAsync(r => r.Slug == "mien-nam");
                
                var newProvinces = new List<Province>
                {
                    // Miền Bắc (15 đơn vị)
                    new Province { Name = "Hà Nội", Slug = "ha-noi", RegionId = north.Id },
                    new Province { Name = "Tuyên Quang", Slug = "tuyen-quang", RegionId = north.Id },
                    new Province { Name = "Lào Cai", Slug = "lao-cai", RegionId = north.Id },
                    new Province { Name = "Thái Nguyên", Slug = "thai-nguyen", RegionId = north.Id },
                    new Province { Name = "Phú Thọ", Slug = "phu-tho", RegionId = north.Id },
                    new Province { Name = "Bắc Ninh", Slug = "bac-ninh", RegionId = north.Id },
                    new Province { Name = "Hưng Yên", Slug = "hung-yen", RegionId = north.Id },
                    new Province { Name = "Hải Phòng", Slug = "hai-phong", RegionId = north.Id },
                    new Province { Name = "Ninh Bình", Slug = "ninh-binh", RegionId = north.Id },
                    new Province { Name = "Lai Châu", Slug = "lai-chau", RegionId = north.Id },
                    new Province { Name = "Điện Biên", Slug = "dien-bien", RegionId = north.Id },
                    new Province { Name = "Sơn La", Slug = "son-la", RegionId = north.Id },
                    new Province { Name = "Lạng Sơn", Slug = "lang-son", RegionId = north.Id },
                    new Province { Name = "Quảng Ninh", Slug = "quang-ninh", RegionId = north.Id },
                    new Province { Name = "Cao Bằng", Slug = "cao-bang", RegionId = north.Id },

                    // Miền Trung (11 đơn vị)
                    new Province { Name = "Quảng Trị", Slug = "quang-tri", RegionId = central.Id },
                    new Province { Name = "Đà Nẵng", Slug = "da-nang", RegionId = central.Id },
                    new Province { Name = "Quảng Ngãi", Slug = "quang-ngai", RegionId = central.Id },
                    new Province { Name = "Gia Lai", Slug = "gia-lai", RegionId = central.Id },
                    new Province { Name = "Khánh Hòa", Slug = "khanh-hoa", RegionId = central.Id },
                    new Province { Name = "Lâm Đồng", Slug = "lam-dong", RegionId = central.Id },
                    new Province { Name = "Đắk Lắk", Slug = "dak-lak", RegionId = central.Id },
                    new Province { Name = "Huế", Slug = "hue", RegionId = central.Id },
                    new Province { Name = "Thanh Hóa", Slug = "thanh-hoa", RegionId = central.Id },
                    new Province { Name = "Nghệ An", Slug = "nghe-an", RegionId = central.Id },
                    new Province { Name = "Hà Tĩnh", Slug = "ha-tinh", RegionId = central.Id },

                    // Miền Nam (8 đơn vị)
                    new Province { Name = "TP.HCM", Slug = "tphcm", RegionId = south.Id },
                    new Province { Name = "Đồng Nai", Slug = "dong-nai", RegionId = south.Id },
                    new Province { Name = "Tây Ninh", Slug = "tay-ninh", RegionId = south.Id },
                    new Province { Name = "Cần Thơ", Slug = "can-tho", RegionId = south.Id },
                    new Province { Name = "Vĩnh Long", Slug = "vinh-long", RegionId = south.Id },
                    new Province { Name = "Đồng Tháp", Slug = "dong-thap", RegionId = south.Id },
                    new Province { Name = "Cà Mau", Slug = "ca-mau", RegionId = south.Id },
                    new Province { Name = "An Giang", Slug = "an-giang", RegionId = south.Id }
                };

                if (needsUpdate)
                {
                    var existingProvinces = await context.Provinces.OrderBy(p => p.Id).ToListAsync();
                    for (int i = 0; i < 34; i++)
                    {
                        existingProvinces[i].Name = newProvinces[i].Name;
                        existingProvinces[i].Slug = newProvinces[i].Slug;
                        existingProvinces[i].RegionId = newProvinces[i].RegionId;
                    }
                }
                else
                {
                    await context.Provinces.AddRangeAsync(newProvinces);
                }
                
                await context.SaveChangesAsync();
            }

            // 5. Seed Categories
            if (!context.DestinationCategories.Any())
            {
                var categories = new List<DestinationCategory>
                {
                    new DestinationCategory { Name = "Biển đảo", Slug = "bien-dao" },
                    new DestinationCategory { Name = "Núi rừng", Slug = "nui-rung" },
                    new DestinationCategory { Name = "Di tích lịch sử", Slug = "di-tich" },
                    new DestinationCategory { Name = "Sinh thái", Slug = "sinh-thai" }
                };
                await context.DestinationCategories.AddRangeAsync(categories);
                await context.SaveChangesAsync();
            }

            // 5.5 Seed 7 new detailed destinations
            var adminUser = await userManager.FindByEmailAsync("admin@celestia.vn");
            var destSlugs = new List<string> { "vinh-ha-long", "pho-co-hoi-an", "dao-phu-quoc", "sa-pa", "co-do-hue", "ba-na-hills", "trang-an" };
            
            var existingDestinations = await context.Destinations.Select(d => d.Slug).ToListAsync();
            var destinationsToAdd = new List<Destination>();
            
            // Get foreign keys
            var qn = await context.Provinces.FirstOrDefaultAsync(p => p.Slug == "quang-ninh");
            var dn = await context.Provinces.FirstOrDefaultAsync(p => p.Slug == "da-nang");
            var ag = await context.Provinces.FirstOrDefaultAsync(p => p.Slug == "an-giang");
            var lc = await context.Provinces.FirstOrDefaultAsync(p => p.Slug == "lao-cai");
            var hue = await context.Provinces.FirstOrDefaultAsync(p => p.Slug == "hue");
            var nb = await context.Provinces.FirstOrDefaultAsync(p => p.Slug == "ninh-binh");
            
            var bienDao = await context.DestinationCategories.FirstOrDefaultAsync(c => c.Slug == "bien-dao");
            var nuiRung = await context.DestinationCategories.FirstOrDefaultAsync(c => c.Slug == "nui-rung");
            var diTich = await context.DestinationCategories.FirstOrDefaultAsync(c => c.Slug == "di-tich");
            var sinhThai = await context.DestinationCategories.FirstOrDefaultAsync(c => c.Slug == "sinh-thai");

            if (!existingDestinations.Contains("vinh-ha-long") && qn != null && bienDao != null)
            {
                destinationsToAdd.Add(new Destination {
                    Name = "Vịnh Hạ Long", Slug = "vinh-ha-long", ProvinceId = qn.Id, CategoryId = bienDao.Id,
                    Description = "Vịnh Hạ Long, di sản thiên nhiên thế giới được UNESCO công nhận, là một trong những điểm đến ngoạn mục nhất của Việt Nam. Nơi đây sở hữu hàng ngàn hòn đảo đá vôi kỳ vĩ vươn lên từ mặt nước xanh ngọc lục bảo, tạo nên một bức tranh thủy mặc khổng lồ tuyệt đẹp. Khám phá Hạ Long trên những du thuyền sang trọng, chèo thuyền kayak qua những hang động kỳ bí hay ngắm nhìn hoàng hôn rực rỡ buông xuống mặt vịnh chắc chắn sẽ là những trải nghiệm không thể nào quên.",
                    Address = "Thành phố Hạ Long, Quảng Ninh", CoverImageUrl = "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1200&auto=format&fit=crop", IsActive = true, IsFeatured = true, Rating = 4.9, AuthorId = adminUser?.Id ?? 1
                });
            }
            
            if (!existingDestinations.Contains("pho-co-hoi-an") && dn != null && diTich != null)
            {
                destinationsToAdd.Add(new Destination {
                    Name = "Phố cổ Hội An", Slug = "pho-co-hoi-an", ProvinceId = dn.Id, CategoryId = diTich.Id,
                    Description = "Hội An, một trong những thương cảng sầm uất nhất Đông Nam Á vào thế kỷ 16-17, đến nay vẫn giữ nguyên được nét đẹp cổ kính trầm mặc. Từng góc phố, mái ngói rêu phong cho đến những chiếc lồng đèn lụa đủ màu sắc rực rỡ giăng kín các nẻo đường đều mang đến cảm giác hoài niệm, bình yên. Hãy thưởng thức một bát cao lầu đậm đà, ngồi thuyền thả hoa đăng trên sông Hoài và đắm chìm trong không gian văn hóa đặc sắc chỉ có ở Hội An.",
                    Address = "Phố cổ Hội An, Đà Nẵng", CoverImageUrl = "https://images.unsplash.com/photo-1555921015-c26206080ec5?q=80&w=1200&auto=format&fit=crop", IsActive = true, IsFeatured = true, Rating = 4.8, AuthorId = adminUser?.Id ?? 1
                });
            }

            if (!existingDestinations.Contains("dao-phu-quoc") && ag != null && bienDao != null)
            {
                destinationsToAdd.Add(new Destination {
                    Name = "Đảo Phú Quốc", Slug = "dao-phu-quoc", ProvinceId = ag.Id, CategoryId = bienDao.Id,
                    Description = "Đảo Ngọc Phú Quốc, hòn đảo lớn nhất Việt Nam, là thiên đường nghỉ dưỡng với những bãi biển cát trắng mịn màng trải dài như Bãi Sao, Bãi Dài cùng làn nước trong vắt màu ngọc bích. Không chỉ có biển xanh cát trắng, Phú Quốc còn hấp dẫn du khách bởi những rạn san hô rực rỡ, vườn quốc gia hoang sơ và ẩm thực biển tươi ngon nức tiếng. Nơi đây thực sự là điểm đến hoàn hảo cho những chuyến trốn chạy khỏi nhịp sống ồn ào của đô thị.",
                    Address = "Đảo Phú Quốc, An Giang", CoverImageUrl = "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=1200&auto=format&fit=crop", IsActive = true, IsFeatured = true, Rating = 4.7, AuthorId = adminUser?.Id ?? 1
                });
            }

            if (!existingDestinations.Contains("sa-pa") && lc != null && nuiRung != null)
            {
                destinationsToAdd.Add(new Destination {
                    Name = "Sa Pa", Slug = "sa-pa", ProvinceId = lc.Id, CategoryId = nuiRung.Id,
                    Description = "Nằm ẩn mình trong mây mù lãng đãng của vùng núi non Tây Bắc, Sa Pa là nơi hội tụ của cảnh sắc thiên nhiên kỳ vĩ và những nét văn hóa đặc sắc của đồng bào dân tộc thiểu số. Từ đỉnh Fansipan - nóc nhà Đông Dương sừng sững, thung lũng Mường Hoa với những thửa ruộng bậc thang vàng óng ả vào mùa lúa chín, cho đến những bản làng Cát Cát bình yên, Sa Pa luôn biết cách níu chân và làm say đắm trái tim của mọi lữ khách.",
                    Address = "Thị xã Sa Pa, Lào Cai", CoverImageUrl = "https://images.unsplash.com/photo-1542326237-94b1c5a538d4?q=80&w=1200&auto=format&fit=crop", IsActive = true, IsFeatured = true, Rating = 4.9, AuthorId = adminUser?.Id ?? 1
                });
            }

            if (!existingDestinations.Contains("co-do-hue") && hue != null && diTich != null)
            {
                destinationsToAdd.Add(new Destination {
                    Name = "Cố đô Huế", Slug = "co-do-hue", ProvinceId = hue.Id, CategoryId = diTich.Id,
                    Description = "Từng là kinh đô của triều đại nhà Nguyễn, Huế mang trong mình vẻ đẹp trầm mặc, cổ kính với quần thể di tích đền đài, lăng tẩm đồ sộ được bảo tồn nguyên vẹn. Dòng sông Hương thơ mộng lững lờ trôi, nhã nhạc cung đình sâu lắng và nụ cười e ấp của người con gái xứ Huế trong tà áo dài tím làm nên một bản sắc rất riêng. Đến với Huế là hành trình tìm về những giá trị lịch sử hào hùng và nét thanh lịch của dân tộc Việt.",
                    Address = "Thành phố Huế, Huế", CoverImageUrl = "https://images.unsplash.com/photo-1581488172937-2cd927692fb4?q=80&w=1200&auto=format&fit=crop", IsActive = true, IsFeatured = false, Rating = 4.6, AuthorId = adminUser?.Id ?? 1
                });
            }

            if (!existingDestinations.Contains("ba-na-hills") && dn != null && nuiRung != null)
            {
                destinationsToAdd.Add(new Destination {
                    Name = "Bà Nà Hills", Slug = "ba-na-hills", ProvinceId = dn.Id, CategoryId = nuiRung.Id,
                    Description = "Được mệnh danh là 'Đà Lạt của miền Trung', Bà Nà Hills mang đến trải nghiệm bốn mùa trong một ngày cùng phong cảnh thiên nhiên tuyệt mỹ. Ngồi trên hệ thống cáp treo đạt nhiều kỷ lục thế giới, du khách sẽ được ngắm nhìn toàn cảnh rừng núi hùng vĩ trước khi bước vào Cầu Vàng - kiệt tác kiến trúc nổi tiếng toàn cầu. Khu làng Pháp cổ kính và những vườn hoa rực rỡ tại đây chắc chắn sẽ khiến bạn ngỡ như đang lạc bước giữa châu Âu lãng mạn.",
                    Address = "Núi Chúa, Đà Nẵng", CoverImageUrl = "https://images.unsplash.com/photo-1549488344-c148e65e6e8e?q=80&w=1200&auto=format&fit=crop", IsActive = true, IsFeatured = true, Rating = 4.8, AuthorId = adminUser?.Id ?? 1
                });
            }

            if (!existingDestinations.Contains("trang-an") && nb != null && sinhThai != null)
            {
                destinationsToAdd.Add(new Destination {
                    Name = "Tràng An", Slug = "trang-an", ProvinceId = nb.Id, CategoryId = sinhThai.Id,
                    Description = "Quần thể danh thắng Tràng An được ví như 'Hạ Long trên cạn' với hệ thống dãy núi đá vôi hùng vĩ có tuổi đời hàng trăm triệu năm, bao bọc những thung lũng ngập nước và những hang động huyền bí. Ngồi trên con thuyền nhỏ mộc mạc xuôi theo dòng nước trong vắt, lách qua từng vách đá và chiêm ngưỡng thảm thực vật phong phú, bạn sẽ cảm nhận được sự hòa quyện tuyệt đẹp giữa trời, đất và nước, một vẻ đẹp nguyên sơ và tĩnh lặng đến nao lòng.",
                    Address = "Hoa Lư, Ninh Bình", CoverImageUrl = "https://images.unsplash.com/photo-1518144591331-17a5dd71c477?q=80&w=1200&auto=format&fit=crop", IsActive = true, IsFeatured = true, Rating = 4.9, AuthorId = adminUser?.Id ?? 1
                });
            }

            if (destinationsToAdd.Any())
            {
                await context.Destinations.AddRangeAsync(destinationsToAdd);
                await context.SaveChangesAsync();
            }

            // 5.6 Clone Landing Page from "Biển Vũng Tàu" for the 7 new destinations
            var vungTauDest = await context.Destinations.FirstOrDefaultAsync(d => d.Slug == "bien-vung-tau" || d.Name.ToLower().Contains("vũng tàu"));
            if (vungTauDest != null)
            {
                var vungTauConfig = await context.LandingPageConfigs
                    .Include(c => c.Sections)
                    .FirstOrDefaultAsync(c => c.DestinationId == vungTauDest.Id);
                    
                if (vungTauConfig != null)
                {
                    bool configAdded = false;
                    foreach (var destSlug in destSlugs)
                    {
                        var targetDest = await context.Destinations.FirstOrDefaultAsync(d => d.Slug == destSlug);
                        if (targetDest != null)
                        {
                            var hasConfig = await context.LandingPageConfigs.AnyAsync(c => c.DestinationId == targetDest.Id);
                            if (!hasConfig)
                            {
                                var newConfig = new LandingPageConfig
                                {
                                    DestinationId = targetDest.Id,
                                    ThemeId = vungTauConfig.ThemeId,
                                    CustomPrimaryColor = vungTauConfig.CustomPrimaryColor,
                                    CustomSecondaryColor = vungTauConfig.CustomSecondaryColor,
                                    CustomFontFamily = vungTauConfig.CustomFontFamily,
                                    HeroTitle = targetDest.Name,
                                    HeroSubtitle = vungTauConfig.HeroSubtitle,
                                    HeroImageUrl = targetDest.CoverImageUrl,
                                    HeroVideoUrl = vungTauConfig.HeroVideoUrl,
                                    SeoTitle = targetDest.Name + " - Celestia Travel",
                                    SeoDescription = targetDest.Description,
                                    Sections = vungTauConfig.Sections.Select(s => new LandingPageSection
                                    {
                                        SectionType = s.SectionType,
                                        Title = s.SectionType == "MainContent" ? targetDest.Name : s.Title,
                                        Subtitle = s.SectionType == "MainContent" ? targetDest.Name : s.Subtitle,
                                        ContentJson = s.SectionType == "MainContent" ? "{}" : s.ContentJson,
                                        HtmlRendered = s.SectionType == "MainContent" ? $@"
<div style=""padding: 60px 20px; max-width: 1000px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"">
    <div style=""text-align: center; margin-bottom: 50px;"">
        <h1 style=""font-size: 3.5rem; color: #2c3e50; font-weight: 800; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 2px;"">Khám Phá {targetDest.Name}</h1>
        <div style=""width: 80px; height: 4px; background-color: #1abc9c; margin: 0 auto;""></div>
    </div>
    
    <div style=""display: flex; flex-direction: column; gap: 40px;"">
        <div style=""border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);"">
            <img src=""{targetDest.CoverImageUrl}"" alt=""{targetDest.Name}"" style=""width: 100%; height: auto; display: block; max-height: 600px; object-fit: cover;""/>
        </div>
        
        <div style=""background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05);"">
            <h2 style=""font-size: 2rem; color: #34495e; margin-bottom: 20px;"">Hành Trình Đến Với {targetDest.Name}</h2>
            <p style=""font-size: 1.25rem; color: #555; line-height: 1.8; text-align: justify;"">
                {targetDest.Description}
            </p>
            <div style=""margin-top: 30px; padding-top: 30px; border-top: 1px solid #eee; text-align: center;"">
                <p style=""font-size: 1.1rem; color: #7f8c8d; font-style: italic;"">
                    ""Một điểm đến không thể bỏ lỡ trong hành trình của bạn. Hãy để {targetDest.Name} mang lại những kỷ niệm tuyệt vời nhất!""
                </p>
            </div>
        </div>
    </div>
</div>" : s.HtmlRendered,
                                        CssRendered = s.SectionType == "MainContent" ? "" : s.CssRendered,
                                        SortOrder = s.SortOrder
                                    }).ToList()
                                };
                                context.LandingPageConfigs.Add(newConfig);
                                configAdded = true;
                            }
                        }
                    }
                    
                    if (configAdded)
                    {
                        await context.SaveChangesAsync();
                    }
                }
            }

            // 6. Seed Tour Packages & Bookings
            if (!context.TourPackages.Any())
            {
                var destination = await context.Destinations.FirstOrDefaultAsync(d => d.Slug == "tam-dao");
                if (destination == null)
                {
                    destination = new Destination
                    {
                        Name = "Tam Đảo",
                        Slug = "tam-dao",
                        ProvinceId = context.Provinces.First().Id,
                        CategoryId = context.DestinationCategories.First().Id,
                        IsActive = true,
                        Description = "Thị trấn sương mù xinh đẹp."
                    };
                    context.Destinations.Add(destination);
                    await context.SaveChangesAsync();
                }

                var travelerUser = await userManager.FindByEmailAsync("traveler@celestia.vn");

                var tours = new List<TourPackage>
                {
                    new TourPackage { Name = "Tour Khám Phá Tam Đảo 2 Ngày 1 Đêm", Description = "Trải nghiệm mây mù và không khí se lạnh.", Price = 1500000, DurationDays = 2, DestinationId = destination.Id, AuthorId = adminUser?.Id ?? 1 },
                    new TourPackage { Name = "Nghỉ dưỡng Tam Đảo Cuối Tuần", Description = "Thư giãn tại resort cao cấp.", Price = 2500000, DurationDays = 3, DestinationId = destination.Id, AuthorId = adminUser?.Id ?? 1 }
                };
                await context.TourPackages.AddRangeAsync(tours);
                await context.SaveChangesAsync();

                if (!context.Bookings.Any() && travelerUser != null)
                {
                    var bookings = new List<Booking>
                    {
                        new Booking { UserId = travelerUser.Id, TourPackageId = tours[0].Id, BookingDate = System.DateTime.UtcNow.AddDays(-2), TravelDate = System.DateTime.UtcNow.AddDays(5), NumberOfPeople = 2, TotalAmount = 3000000, Status = BookingStatus.Pending },
                        new Booking { UserId = travelerUser.Id, TourPackageId = tours[1].Id, BookingDate = System.DateTime.UtcNow.AddDays(-5), TravelDate = System.DateTime.UtcNow.AddDays(10), NumberOfPeople = 4, TotalAmount = 10000000, Status = BookingStatus.Confirmed }
                    };
                    await context.Bookings.AddRangeAsync(bookings);
                    await context.SaveChangesAsync();
                }
            }

            // 7. Seed eMagazine Articles
            if (!context.Articles.Any())
            {
                var articles = new List<Article>
                {
                    new Article
                    {
                        Title = "Hội An - Bản Tình Ca Của Thời Gian Và Ký Ức",
                        Slug = "hoi-an-ban-tinh-ca-cua-thoi-gian",
                        Excerpt = "Hội An không chỉ là một đô thị cổ kính với những bức tường vàng rêu phong hay giàn hoa giấy rực rỡ. Hội An là một bản tình ca nhẹ nhàng...",
                        ThumbnailUrl = "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1000&auto=format&fit=crop",
                        AuthorId = adminUser?.Id ?? 1,
                        ContentJson = @"<h2><strong style=""background-color: rgb(255, 255, 255); color: rgb(33, 33, 33);""><em>Hội An là điểm đến lý tưởng để bạn rời xa cuộc sống đô thị ồn ào và đắm mình vào phố cổ yên bình. Để Klook Vietnam mách bạn kinh nghiệm du lịch Hội An tự túc thật vui và tiết kiệm nhé. </em></strong></h2><p><span style=""background-color: rgb(255, 255, 255); color: rgb(33, 33, 33);""> từ lâu đã trở thành lựa chọn không thể bỏ qua trong hành trình khám phá Việt Nam. Sở hữu vẻ đẹp cổ kính, kiến trúc độc đáo và nền văn hóa đậm đà bản sắc, Hội An đã và đang chinh phục trái tim của biết bao du khách.</span></p><p><span style=""background-color: rgb(255, 255, 255); color: rgb(33, 33, 33);"">Hội An nằm ở tỉnh Quảng Nam (nay đã được sáp nhập vào Đà Nẵng), cách thành phố Đà Nẵng khoảng 30 km, được UNESCO công nhận là Di sản Văn hóa Thế giới. Phố cổ nổi bật với những ngôi nhà mái ngói rêu phong, con đường rực rỡ đèn lồng và dòng sông Hoài thơ mộng chảy qua. Vị trí thuận tiện cùng bầu không khí yên bình khiến nơi đây trở thành điểm dừng chân lý tưởng cho hành trình khám phá miền Trung.</span></p><p><span style=""background-color: rgb(255, 255, 255); color: rgb(33, 33, 33);"">Sức hút của Hội An đến từ sự giao thoa văn hóa Á – Âu trong kiến trúc, ẩm thực và lối sống. Du khách say mê những buổi tối lung linh ánh đèn lồng, thưởng thức cao lầu, mì Quảng hay bánh mì Hội An trứ danh. Không chỉ là nơi lưu giữ ký ức lịch sử, Hội An còn mang đến trải nghiệm lãng mạn và đầy cảm hứng cho bất kỳ ai ghé thăm.</span></p><p><span style=""background-color: rgb(255, 255, 255); color: rgb(33, 33, 33);"">Hội An đẹp quanh năm, nhưng mùa khô (từ tháng 2 đến tháng 4) được xem là thời điểm lý tưởng nhất để du lịch. Trong khoảng thời gian này, thời tiết ở Hội An khá mát mẻ và dễ chịu, với nhiệt độ trung bình từ 24°C đến 30°C. Điều này giúp bạn cảm thấy thoải mái và thoáng đãng khi tham quan phố cổ.</span></p><p><span style=""background-color: rgb(255, 255, 255); color: rgb(33, 33, 33);"">Tuy nhiên, mùa mưa (từ tháng 9 đến tháng 1) cũng có những nét quyến rũ riêng, bất chấp thời tiết ẩm ướt do mưa nhiều. Để chuẩn bị cho chuyến đi, bạn nên theo dõi dự báo thời tiết và mang theo trang phục phù hợp. Ngoài ra, đừng quên mang theo ô hoặc áo mưa để phòng trường hợp trời mưa bất chợt.</span></p><p><span style=""background-color: rgb(255, 255, 255); color: rgb(33, 33, 33);"">Hội An vẫn còn ẩn chứa bao điều bất ngờ đang chờ bạn khám phá. Hãy đến và tự mình cảm nhận vẻ đẹp cổ kính, lãng mạn của phố cổ, nơi được mệnh danh là &quot;Venice của Việt Nam&quot; nha.</span></p>"
                    },
                    new Article
                    {
                        Title = "Đà Lạt Mùa Sương Bạc: Bản Tình Ca Phố Núi",
                        Slug = "da-lat-mua-suong-bac",
                        Excerpt = "Một góc nhìn khác về Đà Lạt trong những ngày sương mù giăng lối, tĩnh lặng và đầy lãng mạn.",
                        ThumbnailUrl = "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=1000&auto=format&fit=crop",
                        AuthorId = adminUser?.Id ?? 1,
                        ContentJson = @"
                        <div class='magazine-content space-y-6 text-lg text-gray-800 leading-relaxed font-serif'>
                            <p class='drop-cap text-2xl font-bold text-primary float-left mr-3 text-5xl mt-2'>K</p>
                            <p>hi cái lạnh đầu đông chạm đến, Đà Lạt khoác lên mình một tấm áo choàng mờ ảo của sương bạc. Không rực rỡ như mùa hoa mai anh đào, cũng chẳng ồn ào náo nhiệt như những ngày hội hè, Đà Lạt lúc này mang vẻ đẹp u tịch đến lạ thường.</p>
                            
                            <img src='https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=1200&auto=format&fit=crop' alt='Đà Lạt sương mù' class='w-full rounded-2xl shadow-xl my-8 object-cover h-[500px]' />
                            
                            <h2 class='text-3xl font-bold text-gray-900 mt-10 mb-4 font-sans'>Khúc Nhạc Của Gỗ Và Thông</h2>
                            <p>Mỗi bước chân trên con dốc nhỏ đều mang lại cảm giác thân thuộc. Tiếng lá thông khô vỡ vụn dưới gót giày, hòa cùng tiếng gió lướt qua những mái tôn rỉ sét cũ kỹ. Nhấp một ngụm cà phê nóng tại góc quán quen ở khu Hòa Bình, nhìn màn sương mờ dần xua đi để nhường chỗ cho những tia nắng yếu ớt, ta mới thấy thời gian trôi chậm lại.</p>
                            
                            <blockquote class='border-l-4 border-secondary pl-6 italic text-xl my-8 text-gray-600'>
                                ""Đà Lạt không phải là nơi để vội vã. Nó là nơi để người ta học cách lắng nghe nhịp đập của trái tim mình, giữa thiên nhiên tĩnh lặng.""
                            </blockquote>
                            
                            <p>Rời xa khỏi vòng xoáy của deadline và còi xe đô thị, Đà Lạt mùa này đích thị là một liều thuốc chữa lành tuyệt vời nhất mà bạn có thể tìm thấy ở độ cao 1500m.</p>
                        </div>"
                    },
                    new Article
                    {
                        Title = "Hội An Đêm Rằm: Lạc Bước Về Quá Khứ",
                        Slug = "hoi-an-dem-ram",
                        Excerpt = "Trải nghiệm dạo bước dưới ánh lồng đèn đỏ lấp lánh bên bờ sông Hoài.",
                        ThumbnailUrl = "https://images.unsplash.com/photo-1581488172937-2cd927692fb4?q=80&w=1000&auto=format&fit=crop",
                        AuthorId = adminUser?.Id ?? 1,
                        ContentJson = @"
                        <div class='magazine-content space-y-6 text-lg text-gray-800 leading-relaxed font-serif'>
                            <p class='drop-cap text-2xl font-bold text-primary float-left mr-3 text-5xl mt-2'>N</p>
                            <p>hững đêm trăng rằm, phố cổ Hội An như bừng sáng với hàng ngàn chiếc lồng đèn đầy màu sắc thay cho ánh sáng đèn điện hiện đại. Đi dọc theo dòng sông Hoài lấp lánh những ngọn đèn hoa đăng nhỏ bé trôi lững lờ, bạn sẽ có cảm tưởng như đang du hành ngược thời gian về một thương cảng sầm uất thế kỷ 17.</p>
                            
                            <div class='grid grid-cols-2 gap-4 my-8'>
                                <img src='https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=600&auto=format&fit=crop' alt='Hội An góc 1' class='w-full rounded-xl shadow-lg object-cover h-64' />
                                <img src='https://images.unsplash.com/photo-1555921015-c26206080ec5?q=80&w=600&auto=format&fit=crop' alt='Hội An góc 2' class='w-full rounded-xl shadow-lg object-cover h-64' />
                            </div>
                            
                            <h2 class='text-3xl font-bold text-gray-900 mt-10 mb-4 font-sans'>Hương Vị Hoài Cổ</h2>
                            <p>Đâu chỉ có cảnh sắc, Hội An còn quyến rũ du khách bởi hương vị ẩm thực độc đáo. Một bát Cao Lầu sần sật, đậm vị, hay miếng bánh mì Phượng giòn rụm đều là những trải nghiệm khó quên.</p>
                        </div>"
                    },
                    new Article
                    {
                        Title = "Tây Bắc Mùa Lúa Chín: Kiệt Tác Trên Đồi Núi",
                        Slug = "tay-bac-mua-lua-chin",
                        Excerpt = "Ngắm nhìn những dải lụa vàng ươm vắt ngang sườn đồi, tạo nên bức tranh thiên nhiên kỳ vĩ.",
                        ThumbnailUrl = "https://images.unsplash.com/photo-1542326237-94b1c5a538d4?q=80&w=1000&auto=format&fit=crop",
                        AuthorId = adminUser?.Id ?? 1,
                        ContentJson = @"
                        <div class='magazine-content space-y-6 text-lg text-gray-800 leading-relaxed font-serif'>
                            <p class='drop-cap text-2xl font-bold text-primary float-left mr-3 text-5xl mt-2'>T</p>
                            <p>háng 9 về mang theo sắc thu se lạnh và cả một vùng trời vàng rực rỡ của những thuở ruộng bậc thang Mù Cang Chải, Hoàng Su Phì. Đây là thời điểm mà Tây Bắc phô diễn vẻ đẹp tráng lệ nhất của mình.</p>
                            
                            <img src='https://images.unsplash.com/photo-1518144591331-17a5dd71c477?q=80&w=1200&auto=format&fit=crop' alt='Mù Cang Chải' class='w-full rounded-2xl shadow-xl my-8 object-cover h-[500px]' />
                            
                            <p>Sự kiệt tác không chỉ đến từ bàn tay tạo hóa mà còn nhờ vào công sức bao đời của người nông dân vùng cao. Từng lớp ruộng bậc thang ôm lấy sườn núi, lượn sóng theo địa hình, nhuộm vàng rực rỡ cả một góc trời báo hiệu một mùa màng ấm no.</p>
                        </div>"
                    }
                };
                
                await context.Articles.AddRangeAsync(articles);
                await context.SaveChangesAsync();
            }

            // 8. Seed Social Posts
            if (!context.SocialPosts.Any())
            {
                var travelerUser = await userManager.FindByEmailAsync("traveler@celestia.vn");
                var daLat = await context.Destinations.FirstOrDefaultAsync(d => d.Slug == "da-lat");
                var sapa = await context.Destinations.FirstOrDefaultAsync(d => d.Slug == "sa-pa");

                var posts = new List<SocialPost>
                {
                    new SocialPost
                    {
                        UserId = travelerUser?.Id ?? 2,
                        Content = "Mùa này lên Sa Pa săn mây thì tuyệt vời ông mặt trời! Có ai rảnh cuối tuần này xách balo lên và đi cùng mình không nhỉ? Mình đã book phòng homestay siêu xinh rồi nè. Đi chung cho vui nhaaa!",
                        MediaUrl = "https://images.unsplash.com/photo-1549488344-c148e65e6e8e?q=80&w=1000&auto=format&fit=crop",
                        DestinationId = sapa?.Id,
                        IsLookingForCompanion = true,
                        TravelDate = System.DateTime.UtcNow.AddDays(3),
                        LikesCount = 12,
                        CommentsCount = 0,
                        CreatedAt = System.DateTime.UtcNow.AddHours(-5)
                    },
                    new SocialPost
                    {
                        UserId = adminUser?.Id ?? 1,
                        Content = "Một góc chill chill tại Đà Lạt buổi sáng sớm. Nhiệt độ chỉ 16 độ C, ly cà phê nóng hổi và không khí trong lành... Thật sự không muốn về lại thành phố tấp nập chút nào.",
                        MediaUrl = "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=1000&auto=format&fit=crop",
                        DestinationId = daLat?.Id,
                        IsLookingForCompanion = false,
                        LikesCount = 45,
                        CommentsCount = 0,
                        CreatedAt = System.DateTime.UtcNow.AddDays(-1)
                    },
                    new SocialPost
                    {
                        UserId = travelerUser?.Id ?? 2,
                        Content = "Hội An đêm rằm thực sự lung linh ngoài sức tưởng tượng của mình. Ăn cao lầu, thả đèn hoa đăng và dạo quanh phố cổ... một chuyến đi chữa lành tuyệt đối!",
                        MediaUrl = "https://images.unsplash.com/photo-1581488172937-2cd927692fb4?q=80&w=1000&auto=format&fit=crop",
                        IsLookingForCompanion = false,
                        LikesCount = 28,
                        CommentsCount = 0,
                        CreatedAt = System.DateTime.UtcNow.AddDays(-2)
                    }
                };

                await context.SocialPosts.AddRangeAsync(posts);
                await context.SaveChangesAsync();
            }
        }
    }
}
