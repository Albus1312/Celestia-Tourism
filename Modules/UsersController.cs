using Celestia.Classes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Celestia.Modules
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;

        public UsersController(UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userManager.Users.Where(u => !u.IsHidden).ToListAsync();
            var userRoles = new List<object>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                userRoles.Add(new
                {
                    id = user.Id,
                    email = user.Email,
                    fullName = user.FullName,
                    isDeleted = user.IsDeleted,
                    role = roles.FirstOrDefault() ?? "Traveler",
                    createdAt = user.CreatedAt
                });
            }

            return Ok(userRoles.OrderBy(u => u.GetType().GetProperty("id").GetValue(u, null)));
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
                return BadRequest(new { message = "Email already exists." });

            var newUser = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                FullName = dto.FullName,
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(newUser, dto.Password);
            if (!result.Succeeded)
            {
                return BadRequest(new { message = "Tạo người dùng thất bại.", errors = result.Errors });
            }

            // Assign role
            var roleToAssign = !string.IsNullOrEmpty(dto.Role) ? dto.Role : "Traveler";
            if (await _roleManager.RoleExistsAsync(roleToAssign))
            {
                await _userManager.AddToRoleAsync(newUser, roleToAssign);
            }

            return Ok(new { message = "User created successfully." });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto dto)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null || user.IsHidden)
                return NotFound(new { message = "User not found." });

            user.FullName = dto.FullName;
            
            // Allow email change if needed
            if (user.Email != dto.Email)
            {
                var existing = await _userManager.FindByEmailAsync(dto.Email);
                if (existing != null) return BadRequest(new { message = "Email already in use." });
                user.Email = dto.Email;
                user.UserName = dto.Email;
            }

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return BadRequest(new { message = "Update failed.", errors = result.Errors });

            // Update Password if provided
            if (!string.IsNullOrEmpty(dto.Password))
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var passResult = await _userManager.ResetPasswordAsync(user, token, dto.Password);
                if (!passResult.Succeeded)
                    return BadRequest(new { message = "Password update failed.", errors = passResult.Errors });
            }

            // Update Role
            if (!string.IsNullOrEmpty(dto.Role))
            {
                var currentRoles = await _userManager.GetRolesAsync(user);
                if (!currentRoles.Contains(dto.Role))
                {
                    if (currentRoles.Any())
                        await _userManager.RemoveFromRolesAsync(user, currentRoles);
                    
                    if (await _roleManager.RoleExistsAsync(dto.Role))
                        await _userManager.AddToRoleAsync(user, dto.Role);
                }
            }

            return Ok(new { message = "User updated successfully." });
        }

        [HttpPut("{id}/toggle-lock")]
        public async Task<IActionResult> ToggleUserStatus(int id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null || user.IsHidden)
                return NotFound(new { message = "User not found." });

            var currentUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId == id.ToString())
            {
                return BadRequest(new { message = "Bạn không thể tự khóa tài khoản của chính mình!" });
            }

            user.IsDeleted = !user.IsDeleted;
            await _userManager.UpdateAsync(user);

            return Ok(new { message = user.IsDeleted ? "Tài khoản đã bị khóa." : "Tài khoản đã được mở khóa." });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> HideUser(int id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null || user.IsHidden)
                return NotFound(new { message = "User not found." });

            if (!user.IsDeleted)
            {
                return BadRequest(new { message = "Tài khoản phải bị Khóa trước khi bị ẩn khỏi giao diện!" });
            }

            var currentUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId == id.ToString())
            {
                return BadRequest(new { message = "Bạn không thể tự xóa tài khoản của chính mình!" });
            }

            user.IsHidden = true;
            await _userManager.UpdateAsync(user);

            return Ok(new { message = "Tài khoản đã bị ẩn khỏi giao diện." });
        }
    }

    public class CreateUserDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }

    public class UpdateUserDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty; // Optional
        public string Role { get; set; } = string.Empty;
    }
}
