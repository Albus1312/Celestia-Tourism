process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const articles = [
  {
    title: 'Vũng Tàu - Bình Minh Trên Phố Biển',
    slug: 'vung-tau-binh-minh-tren-pho-bien',
    excerpt: 'Cách Sài Gòn chỉ 2 giờ chạy xe, Vũng Tàu đón ta bằng những cơn gió biển mát lạnh, hải sản tươi ngon và nhịp sống thanh bình nhưng không kém phần sôi động.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1596706972049-7c85854b7914?auto=format&fit=crop&w=1600&q=80',
    contentJson: `<h2>Hơi Thở Của Đại Dương</h2><p>Đến <strong>Vũng Tàu</strong>, trải nghiệm tuyệt vời nhất không phải là lao ngay xuống dòng nước mát lạnh, mà là thuê một chiếc xe máy, chạy dọc con đường ven biển Trần Phú lúc xế chiều. Ở một bên là vách núi đá vươn mình sừng sững, một bên là mặt biển lấp lánh ánh hoàng hôn, những mệt mỏi của thành thị bỗng chốc tan biến.</p><h3>Những Tọa Độ Không Thể Bỏ Lỡ</h3><ul><li><strong>Ngọn Hải Đăng:</strong> Một trong những ngọn hải đăng cổ nhất Việt Nam. Cung đường lên đây ngợp bóng cây cối, đặc biệt vào mùa hoa giấy, đây là thánh địa "sống ảo" của giới trẻ.</li><li><strong>Tượng Chúa Dang Tay:</strong> Leo qua gần 1.000 bậc thang, bạn sẽ được đứng trên cánh tay tượng Chúa, ngắm trọn vẹn đường bờ biển quyến rũ của thành phố.</li><li><strong>Bãi Sau & Bãi Trước:</strong> Nơi hòa mình vào nhịp đập sôi động của Vũng Tàu với hàng vạn món ăn đường phố hấp dẫn.</li></ul><blockquote>Đừng quên thưởng thức món lẩu cá đuối trứ danh và bánh khọt giòn rụm tại Vũng Tàu nhé!</blockquote>`
  },
  {
    title: 'Cố Đô Huế - Vẻ Đẹp Trầm Mặc Của Thời Gian',
    slug: 'co-do-hue-ve-dep-tram-mac-cua-thoi-gian',
    excerpt: 'Nét rêu phong của Kinh thành cổ, dòng Hương Giang lững lờ trôi và những tà áo dài tím biếc làm nên một Huế mộng mơ, sâu lắng đến nao lòng.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1620215975270-1793796d19bc?auto=format&fit=crop&w=1600&q=80',
    contentJson: `<h2>Một Lần Trở Về Quá Khứ</h2><p>Có người bảo <strong>Huế</strong> buồn lắm. Nhưng cái buồn của Huế không bi lụy, mà là sự tĩnh lặng, trầm mặc của một thời vàng son nay đã ngủ yên trong những lớp ngói thanh lưu ly. Từng bước đi qua Ngọ Môn, Đại Nội, ta như nghe được tiếng thở dài của lịch sử vọng về.</p><h3>Hành Trình Khám Phá Di Sản</h3><ul><li><strong>Kinh thành Huế:</strong> Trung tâm quyền lực một thời, nơi lưu giữ những giá trị kiến trúc, điêu khắc nghệ thuật bậc nhất của triều Nguyễn.</li><li><strong>Lăng tẩm các vị vua:</strong> Mỗi lăng tẩm (Lăng Tự Đức, Lăng Khải Định, Lăng Minh Mạng) mang một phong cách kiến trúc riêng biệt, phản ánh rõ nét tính cách của từng vị vua.</li><li><strong>Chùa Thiên Mụ:</strong> Biểu tượng tâm linh của xứ Huế, trầm mặc nghiêng bóng xuống dòng sông Hương thơ mộng.</li></ul><blockquote>Để trải nghiệm trọn vẹn, hãy một lần ngồi thuyền rồng nghe ca Huế trên sông Hương vào buổi tối!</blockquote>`
  },
  {
    title: 'Bà Nà Hills - Đường Lên Tiên Cảnh',
    slug: 'ba-na-hills-duong-len-tien-canh',
    excerpt: 'Lạc lối trong ngôi làng Pháp mộng mơ, bước đi trên chiếc Cầu Vàng nổi tiếng toàn cầu và tận hưởng bốn mùa trong một ngày tại Bà Nà Hills.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1596489069695-934cfa727632?auto=format&fit=crop&w=1600&q=80',
    contentJson: `<h2>Châu Âu Thu Nhỏ Giữa Lòng Đà Nẵng</h2><p>Tọa lạc trên đỉnh núi Chúa, <strong>Bà Nà Hills</strong> được ví như một chốn bồng lai tiên cảnh. Vượt qua tuyến cáp treo đạt nhiều kỷ lục Guinness, bạn sẽ bước vào một không gian cổ kính mang đậm kiến trúc Gothic của châu Âu thế kỷ 19.</p><h3>Điểm Đến Không Thể Bỏ Lỡ</h3><ul><li><strong>Cầu Vàng (Golden Bridge):</strong> Biểu tượng tự hào của du lịch Việt, với đôi bàn tay khổng lồ nâng đỡ dải lụa vàng lấp lánh giữa lưng chừng mây trời.</li><li><strong>Làng Pháp:</strong> Những lâu đài cổ kính, con phố lát đá nhấp nhô và quảng trường rộng lớn khiến bạn ngỡ như đang dạo bước ở Paris.</li><li><strong>Fantasy Park:</strong> Khu vui chơi giải trí trong nhà lớn nhất Việt Nam với vô số trò chơi mạo hiểm và hấp dẫn.</li></ul><p><em>Hãy chuẩn bị cho mình một chiếc áo khoác nhẹ, vì nhiệt độ trên này thường thấp hơn dưới trung tâm Đà Nẵng từ 7-8 độ C nhé.</em></p>`
  },
  {
    title: 'Tràng An - Tuyệt Tác Thủy Mặc Xứ Ninh Bình',
    slug: 'trang-an-tuyet-tac-thuy-mac-xu-ninh-binh',
    excerpt: 'Ngồi trên chiếc thuyền nan nhỏ, lướt qua những hang động kỳ bí, hòa mình vào mây trời non nước, Tràng An đẹp như một bức tranh bích họa.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563212686-fc590bf7ce2d?auto=format&fit=crop&w=1600&q=80',
    contentJson: `<h2>Vịnh Hạ Long Trên Cạn</h2><p>Được UNESCO công nhận là Di sản Văn hóa và Thiên nhiên Thế giới, <strong>Tràng An</strong> hút hồn du khách bởi vẻ đẹp hoang sơ, hệ thống dãy núi đá vôi hùng vĩ ôm trọn những thung lũng nước trong vắt đến tận đáy.</p><h3>Xuôi Dòng Lịch Sử Và Thiên Nhiên</h3><ul><li><strong>Hành trình chèo thuyền nan:</strong> Xuyên qua vô số hang động kỳ ảo như Hang Sáng, Hang Tối, Hang Nấu Rượu, mỗi hang mang một vẻ đẹp thạch nhũ độc đáo.</li><li><strong>Đền Trình, Đền Trần:</strong> Những điểm dừng chân mang ý nghĩa tâm linh và lịch sử sâu sắc, được xây dựng tinh xảo tựa lưng vào vách núi.</li><li><strong>Hành Cung Vũ Lâm:</strong> Di tích lịch sử thời Trần nằm lọt thỏm giữa vùng non nước hữu tình.</li></ul><blockquote>Hãy nán lại Ninh Bình thêm vài ngày để thưởng thức món thịt dê núi nổi tiếng và cơm cháy giòn rụm!</blockquote>`
  },
  {
    title: 'Phú Quốc - Đảo Ngọc Ru Tình',
    slug: 'phu-quoc-dao-ngoc-ru-tinh',
    excerpt: 'Từ những bãi cát trắng mịn như kem đến hệ sinh thái rạn san hô rực rỡ, Phú Quốc thực sự là thiên đường nhiệt đới vạn người mê.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1598950868297-c87a5a82810a?auto=format&fit=crop&w=1600&q=80',
    contentJson: `<h2>Bản Hòa Ca Của Cát Trắng Và Nắng Vàng</h2><p>Đến <strong>Phú Quốc</strong>, dường như mọi âu lo đều bị những cơn sóng biển cuốn trôi. Đảo Ngọc sở hữu những bãi biển thuộc top đẹp nhất hành tinh, nơi hoàng hôn nhuộm đỏ cả một vùng trời nước.</p><h3>Trải Nghiệm Khó Quên</h3><ul><li><strong>Lặn ngắm san hô tại Quần đảo An Thới:</strong> Hệ sinh thái đại dương phong phú với hàng trăm loài san hô và cá biển rực rỡ sắc màu.</li><li><strong>Ngắm hoàng hôn tại Bãi Trường:</strong> Thời khắc mặt trời lặn từ từ chìm xuống biển khơi, biến bầu trời thành một bức tranh siêu thực.</li><li><strong>Khám phá Safari & Grand World:</strong> Trải nghiệm vườn thú bán hoang dã đầu tiên tại Việt Nam và "thành phố không ngủ" sầm uất.</li></ul><p><em>Chuyến đi của bạn sẽ thiếu sót nếu chưa thử Gỏi cá trích và Bún quậy Phú Quốc lừng danh!</em></p>`
  },
  {
    title: 'Ẩm Thực Cố Đô - Tinh Hoa Ẩm Thực Cung Đình',
    slug: 'am-thuc-co-do-tinh-hoa-am-thuc-cung-dinh',
    excerpt: 'Mỗi món ăn tại Huế không chỉ là để no bụng, mà là một tác phẩm nghệ thuật cầu kỳ, lưu giữ những tinh hoa của ẩm thực cung đình Nguyễn.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1620215975270-1793796d19bc?auto=format&fit=crop&w=1600&q=80',
    contentJson: `<h2>Nghệ Thuật Ăn Uống Xứ Thần Kinh</h2><p>Ẩm thực <strong>Huế</strong> cầu kỳ ngay từ khâu chọn nguyên liệu đến cách trình bày. Có người bảo, người Huế ăn bằng mắt, bằng mũi trước khi ăn bằng miệng. Mỗi đĩa bánh, mỗi tô bún đều phảng phất nét duyên dáng, tinh tế của con người nơi đây.</p><h3>Những Tuyệt Phẩm Không Thể Bỏ Lỡ</h3><ul><li><strong>Bún bò Huế:</strong> Vị ruốc sả đặc trưng, nước dùng ngọt thanh từ xương bò và giò heo, cay nồng vị ớt sa tế mặn mòi.</li><li><strong>Các loại bánh Huế:</strong> Bánh bèo chén, bánh nậm mỏng dính, bánh lọc trong suốt dai dai, ăn kèm nước mắm ngọt cay xé lưỡi.</li><li><strong>Cơm hến:</strong> Món ăn dân dã nhưng đòi hỏi đến hàng chục loại nguyên liệu, sự hòa quyện hoàn hảo của chua, cay, mặn, ngọt, bùi, chát.</li></ul><blockquote>Hãy ghé chợ Đông Ba để lạc vào thiên đường ẩm thực đường phố Huế chính hiệu!</blockquote>`
  },
  {
    title: 'Bà Rịa Vũng Tàu - Góc Bình Yên Tại Hồ Tràm',
    slug: 'ba-ria-vung-tau-goc-binh-yen-tai-ho-tram',
    excerpt: 'Không quá ồn ào như trung tâm Vũng Tàu, Hồ Tràm mang đến một không gian nghỉ dưỡng tĩnh lặng, cao cấp ven bờ biển nguyên sơ.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1596706972049-7c85854b7914?auto=format&fit=crop&w=1600&q=80',
    contentJson: `<h2>Chốn Trốn Phồn Hoa Lý Tưởng</h2><p>Nếu bạn cần một nơi để thực sự "chữa lành", hãy rời xa Vũng Tàu náo nhiệt một chút và tìm đến <strong>Hồ Tràm</strong>. Nơi đây giữ được vẻ đẹp hoang sơ với bãi biển thoai thoải, nước trong vắt và dải rừng phi lao xanh ngát ôm dọc bờ biển.</p><h3>Tận Hưởng Sự Xa Hoa</h3><ul><li><strong>Nghỉ dưỡng thượng lưu:</strong> Dọc bờ biển Hồ Tràm là vô số các khu resort chuẩn 5 sao, mang đến trải nghiệm lưu trú đẳng cấp, dịch vụ spa, hồ bơi vô cực ngắm biển tuyệt đẹp.</li><li><strong>Khám phá Rừng sinh thái Bình Châu:</strong> Ngâm mình trong suối nước nóng bùn khoáng Bình Châu, rất tốt cho sức khỏe và xương khớp.</li><li><strong>Chợ hải sản Phước Hải:</strong> Nơi bạn có thể tự tay chọn những mẻ cá, tôm, ghẹ vừa được ngư dân đánh bắt mang về.</li></ul><p><em>Hồ Tràm - nơi thời gian như trôi chậm lại, chỉ còn tiếng sóng vỗ về giấc mơ bình yên.</em></p>`
  }
];

async function seedArticles() {
  let token = '';
  try {
    const loginRes = await fetch('http://127.0.0.1:5251/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@celestia.vn', password: 'Admin@123' })
    });
    const loginData = await loginRes.json();
    token = loginData.token || loginData.accessToken || '';
    if (!token) console.error("No token received", loginData);
  } catch (e) {
    console.error("Login failed", e);
    return;
  }

  for (const article of articles) {
    try {
      const response = await fetch('http://127.0.0.1:5251/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(article)
      });
      if (response.ok) {
        console.log("Successfully seeded: " + article.title);
      } else {
        const err = await response.text();
        console.error("Failed to seed " + article.title + ": " + response.status + " " + err);
      }
    } catch (e) {
      console.error("Network error for " + article.title + ": " + e.message);
    }
  }
}

seedArticles();
