using Celestia.Classes;
using Celestia.Includes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System;

namespace Celestia.Modules
{
    [Route("api/[controller]")]
    [ApiController]
    public class SocialController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SocialController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Social/feed
        [HttpGet("feed")]
        public async Task<ActionResult<object>> GetSocialFeed([FromQuery] int page = 1, [FromQuery] int pageSize = 5)
        {
            // Trả về danh sách bài đăng MXH mới nhất, bao gồm người dùng muốn tìm bạn đồng hành
            int? currentUserId = null;
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!string.IsNullOrEmpty(userIdString) && int.TryParse(userIdString, out int uid))
            {
                currentUserId = uid;
            }

            var query = _context.SocialPosts
                .Where(sp => !sp.IsDeleted)
                .Include(sp => sp.User)
                .Include(sp => sp.LinkedDestination)
                .OrderByDescending(sp => sp.CreatedAt);

            var totalItems = await query.CountAsync();

            var feed = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(sp => new {
                    sp.Id,
                    sp.Content,
                    sp.MediaUrl,
                    sp.UserId,
                    UserName = sp.User != null ? sp.User.FullName : "Người dùng ẩn danh",
                    UserAvatar = "https://ui-avatars.com/api/?name=" + (sp.User != null ? sp.User.FullName : "User"),
                    sp.LikesCount,
                    sp.CommentsCount,
                    sp.IsLookingForCompanion,
                    sp.TravelDate,
                    sp.CreatedAt,
                    sp.DestinationId,
                    DestinationName = sp.LinkedDestination != null ? sp.LinkedDestination.Name : null,
                    IsLikedByMe = currentUserId.HasValue && _context.SocialPostLikes.Any(l => l.SocialPostId == sp.Id && l.UserId == currentUserId.Value)
                })
                .ToListAsync();
            
            return Ok(new {
                posts = feed,
                hasMore = (page * pageSize) < totalItems
            });
        }

        // GET: api/Social/admin/posts
        [Authorize(Roles = "Admin,Editor")]
        [HttpGet("admin/posts")]
        public async Task<ActionResult<IEnumerable<object>>> GetAdminSocialFeed()
        {
            var posts = await _context.SocialPosts
                .Include(sp => sp.User)
                .OrderByDescending(sp => sp.CreatedAt)
                .Select(sp => new {
                    sp.Id,
                    sp.Content,
                    sp.MediaUrl,
                    UserName = sp.User != null ? sp.User.FullName : "Người dùng ẩn danh",
                    sp.LikesCount,
                    sp.CommentsCount,
                    sp.IsLookingForCompanion,
                    sp.CreatedAt,
                    sp.IsDeleted
                })
                .ToListAsync();
            
            return Ok(posts);
        }

        // POST: api/Social/post
        [Authorize] // Bất kỳ ai đăng nhập cũng đăng bài được
        [HttpPost("post")]
        public async Task<ActionResult<SocialPost>> CreatePost(SocialPost post)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
            {
                return Unauthorized();
            }

            post.UserId = userId;
            post.CreatedAt = DateTime.UtcNow;
            post.IsDeleted = false;
            
            if (post.TravelDate.HasValue)
            {
                post.TravelDate = DateTime.SpecifyKind(post.TravelDate.Value, DateTimeKind.Utc);
            }
            
            _context.SocialPosts.Add(post);
            await _context.SaveChangesAsync();



            return Ok(new { message = "Post created successfully", postId = post.Id });
        }

        // DELETE: api/Social/Post/5 (Admin Moderation)
        [Authorize(Roles = "Admin")]
        [HttpDelete("post/{id}")]
        public async Task<IActionResult> DeletePost(int id)
        {
            var post = await _context.SocialPosts.FindAsync(id);
            if (post == null) return NotFound();

            post.IsDeleted = true; // Soft Delete
            await _context.SaveChangesAsync();
            return Ok(new { message = "Post moderated/deleted" });
        }

        // POST: api/Social/post/5/like
        [Authorize]
        [HttpPost("post/{id}/like")]
        public async Task<IActionResult> ToggleLike(int id)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
            {
                return Unauthorized();
            }

            var post = await _context.SocialPosts.FindAsync(id);
            if (post == null || post.IsDeleted)
            {
                return NotFound();
            }

            var existingLike = await _context.SocialPostLikes
                .FirstOrDefaultAsync(l => l.SocialPostId == id && l.UserId == userId);

            bool isLiked;
            if (existingLike != null)
            {
                // Unlike
                _context.SocialPostLikes.Remove(existingLike);
                post.LikesCount = Math.Max(0, post.LikesCount - 1);
                isLiked = false;
            }
            else
            {
                // Like
                var newLike = new SocialPostLike { UserId = userId, SocialPostId = id };
                _context.SocialPostLikes.Add(newLike);
                post.LikesCount += 1;
                isLiked = true;
            }

            await _context.SaveChangesAsync();

            return Ok(new { likesCount = post.LikesCount, isLikedByMe = isLiked });
        }

        // GET: api/Social/post/5/comments
        [HttpGet("post/{id}/comments")]
        public async Task<ActionResult<IEnumerable<object>>> GetComments(int id)
        {
            var comments = await _context.SocialComments
                .Where(c => c.SocialPostId == id && !c.IsDeleted)
                .Include(c => c.User)
                .OrderBy(c => c.CreatedAt)
                .Select(c => new
                {
                    c.Id,
                    c.Content,
                    c.CreatedAt,
                    UserName = c.User != null ? c.User.FullName : "Ẩn danh",
                    UserAvatar = "https://ui-avatars.com/api/?name=" + (c.User != null ? c.User.FullName : "User")
                })
                .ToListAsync();

            return Ok(comments);
        }

        // POST: api/Social/post/5/comment
        [Authorize]
        [HttpPost("post/{id}/comment")]
        public async Task<IActionResult> AddComment(int id, [FromBody] SocialComment comment)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
            {
                return Unauthorized();
            }

            var post = await _context.SocialPosts.FindAsync(id);
            if (post == null || post.IsDeleted)
            {
                return NotFound();
            }

            comment.SocialPostId = id;
            comment.UserId = userId;
            comment.CreatedAt = DateTime.UtcNow;
            comment.IsDeleted = false;

            _context.SocialComments.Add(comment);
            
            post.CommentsCount += 1; // Tăng số lượng comment của bài post
            
            await _context.SaveChangesAsync();

            return Ok(new
            {
                comment.Id,
                comment.Content,
                comment.CreatedAt,
                UserName = User.FindFirstValue(ClaimTypes.Name) ?? "Người dùng",
                UserAvatar = "" 
            });
        }
    }
}
