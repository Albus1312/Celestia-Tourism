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
    public class CommentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CommentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Comments/article/1
        [HttpGet("article/{articleId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetComments(int articleId)
        {
            var comments = await _context.Comments
                .Include(c => c.User)
                .Where(c => c.ArticleId == articleId && c.IsApproved && !c.IsDeleted)
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new {
                    c.Id,
                    c.Content,
                    c.CreatedAt,
                    c.ReportCount,
                    UserName = c.User != null ? c.User.FullName : "Người dùng ẩn danh",
                    UserAvatar = "https://ui-avatars.com/api/?name=" + (c.User != null ? c.User.FullName : "User")
                })
                .ToListAsync();

            return Ok(comments);
        }

        // POST: api/Comments/article/1
        [Authorize]
        [HttpPost("article/{articleId}")]
        public async Task<ActionResult<Comment>> AddComment(int articleId, [FromBody] Comment commentDto)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
            {
                return Unauthorized();
            }

            var article = await _context.Articles.FindAsync(articleId);
            if (article == null) return NotFound("Article not found");

            var comment = new Comment
            {
                ArticleId = articleId,
                UserId = userId,
                Content = commentDto.Content,
                CreatedAt = DateTime.UtcNow,
                IsApproved = true, // Auto approve by default
                ReportCount = 0
            };
            
            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Comment added successfully", id = comment.Id });
        }

        // POST: api/Comments/5/report
        [HttpPost("{id}/report")]
        public async Task<IActionResult> ReportComment(int id)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null) return NotFound();

            comment.ReportCount += 1;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Reported successfully", reportCount = comment.ReportCount });
        }

        // === ADMIN ENDPOINTS ===

        [Authorize(Roles = "Admin,Editor")]
        [HttpGet("admin")]
        public async Task<ActionResult<IEnumerable<object>>> AdminGetComments()
        {
            var comments = await _context.Comments
                .Include(c => c.User)
                .Include(c => c.Article)
                .Where(c => !c.IsDeleted)
                .OrderByDescending(c => c.ReportCount) // Đưa bình luận bị report lên đầu
                .ThenByDescending(c => c.CreatedAt)
                .Select(c => new {
                    c.Id,
                    c.Content,
                    c.CreatedAt,
                    c.IsApproved,
                    c.ReportCount,
                    UserName = c.User != null ? c.User.FullName : "Ẩn danh",
                    ArticleTitle = c.Article != null ? c.Article.Title : "Bài viết đã bị xóa"
                })
                .ToListAsync();

            return Ok(comments);
        }

        [Authorize(Roles = "Admin,Editor")]
        [HttpPut("admin/{id}/toggle-approve")]
        public async Task<IActionResult> AdminToggleApprove(int id)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null) return NotFound();

            comment.IsApproved = !comment.IsApproved;
            
            // Reset report count if approved again
            if (comment.IsApproved) comment.ReportCount = 0;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Status toggled", isApproved = comment.IsApproved });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("admin/{id}")]
        public async Task<IActionResult> AdminDeleteComment(int id)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null) return NotFound();

            comment.IsDeleted = true;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Comment deleted" });
        }
    }
}
