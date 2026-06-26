using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Celestia.Api.Data;
using Celestia.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Celestia.Api.Controllers
{
    [ApiController]
    [Route("api/articles")]
    public class ArticlesController : ControllerBase
    {
        private readonly CelestiaDbContext _context;

        public ArticlesController(CelestiaDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetArticles()
        {
            var articles = await _context.Articles
                .Include(a => a.Author)
                .Include(a => a.Destination)
                .Include(a => a.ArticleTags)
                    .ThenInclude(at => at.Tag)
                .OrderByDescending(a => a.CreatedAt)
                .Select(a => new
                {
                    a.Id,
                    a.Title,
                    a.ThumbnailUrl,
                    AuthorName = a.Author != null ? a.Author.FullName : "Unknown",
                    DestinationName = a.Destination != null ? a.Destination.Name : null,
                    a.CreatedAt,
                    Tags = a.ArticleTags.Select(at => at.Tag!.Name).ToList()
                })
                .ToListAsync();

            return Ok(articles);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetArticle(int id)
        {
            var article = await _context.Articles
                .Include(a => a.Author)
                .Include(a => a.Destination)
                .Include(a => a.ArticleTags)
                    .ThenInclude(at => at.Tag)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (article == null) return NotFound();

            return Ok(new
            {
                article.Id,
                article.Title,
                article.Content,
                article.ThumbnailUrl,
                AuthorName = article.Author?.FullName ?? "Unknown",
                DestinationName = article.Destination?.Name,
                article.CreatedAt,
                Tags = article.ArticleTags.Select(at => at.Tag!.Name).ToList()
            });
        }

        [HttpPost]
        public async Task<IActionResult> CreateArticle([FromBody] Article dto)
        {
            if (string.IsNullOrEmpty(dto.Title) || string.IsNullOrEmpty(dto.Content))
                return BadRequest("Title and Content are required.");

            dto.CreatedAt = DateTime.UtcNow;
            _context.Articles.Add(dto);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetArticle), new { id = dto.Id }, dto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArticle(int id)
        {
            var article = await _context.Articles.FindAsync(id);
            if (article == null) return NotFound();

            _context.Articles.Remove(article);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
