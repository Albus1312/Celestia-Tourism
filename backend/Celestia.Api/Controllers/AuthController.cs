using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Celestia.Api.Data;
using Celestia.Api.Models;
using BCryptNet = BCrypt.Net.BCrypt;

namespace Celestia.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly CelestiaDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(CelestiaDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Username) || 
                string.IsNullOrWhiteSpace(request.Password) || string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.FullName))
            {
                return BadRequest(new { message = "Tất cả các thông tin đăng ký đều bắt buộc phải nhập!" });
            }

            // Check if username already exists
            if (_context.Users.Any(u => u.Username.ToLower() == request.Username.ToLower()))
            {
                return BadRequest(new { message = "Tên đăng nhập này đã được sử dụng!" });
            }

            // Check if email already exists
            if (_context.Users.Any(u => u.Email.ToLower() == request.Email.ToLower()))
            {
                return BadRequest(new { message = "Email này đã được sử dụng!" });
            }

            // Create new User entity with BCrypt hashed password
            var user = new User
            {
                Username = request.Username.Trim(),
                PasswordHash = BCryptNet.HashPassword(request.Password),
                FullName = request.FullName.Trim(),
                Email = request.Email.Trim(),
                Role = "Traveler", // Default role for new signups
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok(new { message = "Đăng ký tài khoản du khách thành công! Bạn có thể tiến hành đăng nhập." });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new { message = "Tên đăng nhập và mật khẩu không được để trống." });
            }

            var user = _context.Users.FirstOrDefault(u => u.Username.ToLower() == request.Username.ToLower());
            
            // Verify user existence, active status, and BCrypt password hash
            if (user == null || !user.IsActive || !BCryptNet.Verify(request.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Tên đăng nhập hoặc mật khẩu không chính xác!" });
            }

            // Generate JWT Token
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("FullName", user.FullName)
            };

            var jwtSecret = _config["Jwt:Secret"] ?? "CelestiaSuperSecretEncryptionKey2026";
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            // Log User Session in PostgreSQL DB
            var session = new UserSession
            {
                UserId = user.Id,
                Token = tokenString,
                IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1",
                UserAgent = Request.Headers["User-Agent"].ToString() ?? "Unknown Browser",
                ExpiresAt = DateTime.UtcNow.AddDays(7),
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.UserSessions.Add(session);
            _context.SaveChanges();

            return Ok(new LoginResponse
            {
                Token = tokenString,
                Username = user.Username,
                FullName = user.FullName,
                Role = user.Role
            });
        }

        [Authorize]
        [HttpGet("me")]
        public IActionResult GetMe()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "Không thể xác định phiên đăng nhập!" });
            }

            int userId = int.Parse(userIdClaim.Value);
            var user = _context.Users.FirstOrDefault(u => u.Id == userId);
            
            if (user == null || !user.IsActive)
            {
                return NotFound(new { message = "Tài khoản không tồn tại hoặc đã bị vô hiệu hóa!" });
            }

            return Ok(new
            {
                user.Id,
                user.Username,
                user.FullName,
                user.Email,
                user.Role
            });
        }

        [Authorize]
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            var authHeader = Request.Headers["Authorization"].ToString();
            if (authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            {
                var token = authHeader.Substring("Bearer ".Length).Trim();
                var session = _context.UserSessions.FirstOrDefault(s => s.Token == token);
                if (session != null)
                {
                    session.IsActive = false;
                    _context.SaveChanges();
                }
            }
            return Ok(new { message = "Đăng xuất thành công!" });
        }
    }
}
