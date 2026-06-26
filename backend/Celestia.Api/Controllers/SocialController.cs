using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Celestia.Api.Data;
using Celestia.Api.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Celestia.Api.Controllers
{
    [ApiController]
    [Route("api/social")]
    public class SocialController : ControllerBase
    {
        private readonly CelestiaDbContext _context;

        public SocialController(CelestiaDbContext context)
        {
            _context = context;
        }

        // GET: api/social/posts
        [HttpGet("posts")]
        public async Task<IActionResult> GetPosts([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var posts = await _context.SocialPosts
                .Include(p => p.User)
                .Include(p => p.LinkedDestination)
                .OrderByDescending(p => p.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new
                {
                    p.Id,
                    p.Content,
                    p.MediaUrl,
                    p.CreatedAt,
                    p.LikesCount,
                    p.CommentsCount,
                    p.IsLookingForCompanion,
                    p.TravelDate,
                    AuthorName = p.User != null ? p.User.FullName : "Unknown",
                    DestinationName = p.LinkedDestination != null ? p.LinkedDestination.Name : null,
                    DestinationId = p.DestinationId
                })
                .ToListAsync();

            return Ok(posts);
        }

        // POST: api/social/posts
        [HttpPost("posts")]
        public async Task<IActionResult> CreatePost([FromBody] SocialPost dto)
        {
            if (string.IsNullOrEmpty(dto.Content))
                return BadRequest("Post content cannot be empty.");

            // Fake user id if not provided for testing purposes
            if (dto.UserId == 0)
            {
                var defaultUser = await _context.Users.FirstOrDefaultAsync();
                if (defaultUser == null) return BadRequest("No users exist.");
                dto.UserId = defaultUser.Id;
            }

            dto.CreatedAt = DateTime.UtcNow;
            dto.LikesCount = 0;
            dto.CommentsCount = 0;

            _context.SocialPosts.Add(dto);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPosts), new { id = dto.Id }, dto);
        }

        // POST: api/social/posts/{id}/like
        [HttpPost("posts/{id}/like")]
        public async Task<IActionResult> LikePost(int id, [FromQuery] int userId = 1) // Using a fake userId for mock
        {
            var post = await _context.SocialPosts.FindAsync(id);
            if (post == null) return NotFound();

            // Just increment for now instead of tracking exactly who liked it for simplicity
            post.LikesCount += 1;
            await _context.SaveChangesAsync();

            return Ok(new { likes = post.LikesCount });
        }

        // GET: api/social/posts/{postId}/comments
        [HttpGet("posts/{postId}/comments")]
        public async Task<IActionResult> GetComments(int postId)
        {
            var comments = await _context.SocialComments
                .Include(c => c.User)
                .Where(c => c.SocialPostId == postId)
                .OrderBy(c => c.CreatedAt)
                .Select(c => new
                {
                    c.Id,
                    c.Content,
                    c.CreatedAt,
                    AuthorName = c.User.FullName
                })
                .ToListAsync();

            return Ok(comments);
        }

        // POST: api/social/posts/{postId}/comments
        [HttpPost("posts/{postId}/comments")]
        public async Task<IActionResult> AddComment(int postId, [FromBody] SocialComment dto)
        {
            var post = await _context.SocialPosts.FindAsync(postId);
            if (post == null) return NotFound();

            if (dto.UserId == 0)
            {
                var defaultUser = await _context.Users.FirstOrDefaultAsync();
                if (defaultUser == null) return BadRequest("No users exist.");
                dto.UserId = defaultUser.Id;
            }

            dto.SocialPostId = postId;
            dto.CreatedAt = DateTime.UtcNow;
            
            _context.SocialComments.Add(dto);
            post.CommentsCount += 1; // Increment denormalized count

            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
