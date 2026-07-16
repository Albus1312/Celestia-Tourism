using Celestia.Classes;
using Celestia.Includes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Celestia.Modules
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArticlesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ArticlesController(ApplicationDbContext context)
        {
            _context = context;
        }




        // GET: api/Articles
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Article>>> GetArticles()
        {
            return await _context.Articles
                .Include(a => a.Destination)
                .Include(a => a.ArticleTags)
                    .ThenInclude(at => at.Tag)
                .ToListAsync();
        }

        // GET: api/Articles/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Article>> GetArticle(int id)
        {
            var article = await _context.Articles
                .Include(a => a.Destination)
                .Include(a => a.ArticleTags)
                    .ThenInclude(at => at.Tag)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (article == null)
            {
                return NotFound();
            }

            return article;
        }

        // GET: api/Articles/slug/{slug}
        [HttpGet("slug/{slug}")]
        public async Task<ActionResult<Article>> GetArticleBySlug(string slug)
        {
            var article = await _context.Articles
                .Include(a => a.Destination)
                .Include(a => a.ArticleTags)
                    .ThenInclude(at => at.Tag)
                .FirstOrDefaultAsync(a => a.Slug == slug);

            if (article == null)
            {
                return NotFound();
            }

            return article;
        }

        // POST: api/Articles
        [Authorize(Roles = "Admin,Editor")]
        [HttpPost]
        public async Task<ActionResult<Article>> CreateArticle(Article article)
        {
            // Note: Cần lấy AuthorId từ Token (User.Identity.Name) trong thực tế
            _context.Articles.Add(article);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetArticle), new { id = article.Id }, article);
        }

        // PUT: api/Articles/5
        [Authorize(Roles = "Admin,Editor")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateArticle(int id, Article article)
        {
            if (id != article.Id)
            {
                return BadRequest();
            }

            _context.Entry(article).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ArticleExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/Articles/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArticle(int id)
        {
            var article = await _context.Articles.FindAsync(id);
            if (article == null)
            {
                return NotFound();
            }

            article.IsDeleted = true; // Soft Delete
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ArticleExists(int id)
        {
            return _context.Articles.Any(e => e.Id == id);
        }

        // GET: api/Articles/5/comments
        [HttpGet("{id}/comments")]
        public async Task<ActionResult<IEnumerable<object>>> GetComments(int id)
        {
            var comments = await _context.Comments
                .Include(c => c.User)
                .Where(c => c.ArticleId == id)
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new
                {
                    c.Id,
                    c.Content,
                    c.CreatedAt,
                    User = new { c.User.FullName, c.User.Email }
                })
                .ToListAsync();

            return Ok(comments);
        }

        // POST: api/Articles/5/comments
        [Authorize]
        [HttpPost("{id}/comments")]
        public async Task<IActionResult> AddComment(int id, [FromBody] CommentDto dto)
        {
            var userIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdString, out int userId))
            {
                return Unauthorized();
            }

            var articleExists = await _context.Articles.AnyAsync(a => a.Id == id);
            if (!articleExists) return NotFound();

            var comment = new Comment
            {
                ArticleId = id,
                UserId = userId,
                Content = dto.Content,
                CreatedAt = System.DateTime.UtcNow
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            // Lấy lại comment vừa tạo để trả về frontend kèm User info
            var newComment = await _context.Comments
                .Include(c => c.User)
                .Where(c => c.Id == comment.Id)
                .Select(c => new
                {
                    c.Id,
                    c.Content,
                    c.CreatedAt,
                    User = new { c.User.FullName, c.User.Email }
                })
                .FirstOrDefaultAsync();

            return Ok(newComment);
        }
    }

    public class CommentDto
    {
        public string Content { get; set; } = string.Empty;
    }
}
