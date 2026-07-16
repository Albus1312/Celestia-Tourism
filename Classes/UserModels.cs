using Microsoft.AspNetCore.Identity;
using System;

namespace Celestia.Classes
{
    // Cần cài đặt package: Microsoft.AspNetCore.Identity.EntityFrameworkCore
    public class ApplicationUser : IdentityUser<int>
    {
        public string FullName { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public bool IsDeleted { get; set; } = false;
        public bool IsHidden { get; set; } = false;
    }

    public class ApplicationRole : IdentityRole<int>
    {
        public string Description { get; set; } = string.Empty;
    }
}
