using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Celestia.Migrations
{
    /// <inheritdoc />
    public partial class AddSocialUserRelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_SocialPosts_UserId",
                table: "SocialPosts",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_SocialComments_UserId",
                table: "SocialComments",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_SocialComments_AspNetUsers_UserId",
                table: "SocialComments",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SocialPosts_AspNetUsers_UserId",
                table: "SocialPosts",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SocialComments_AspNetUsers_UserId",
                table: "SocialComments");

            migrationBuilder.DropForeignKey(
                name: "FK_SocialPosts_AspNetUsers_UserId",
                table: "SocialPosts");

            migrationBuilder.DropIndex(
                name: "IX_SocialPosts_UserId",
                table: "SocialPosts");

            migrationBuilder.DropIndex(
                name: "IX_SocialComments_UserId",
                table: "SocialComments");
        }
    }
}
