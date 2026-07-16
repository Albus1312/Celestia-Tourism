using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Celestia.Migrations
{
    /// <inheritdoc />
    public partial class AddAuthorIdToContent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AuthorId",
                table: "TourPackages",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AuthorId",
                table: "Destinations",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TourPackages_AuthorId",
                table: "TourPackages",
                column: "AuthorId");

            migrationBuilder.CreateIndex(
                name: "IX_Destinations_AuthorId",
                table: "Destinations",
                column: "AuthorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Destinations_AspNetUsers_AuthorId",
                table: "Destinations",
                column: "AuthorId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TourPackages_AspNetUsers_AuthorId",
                table: "TourPackages",
                column: "AuthorId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Destinations_AspNetUsers_AuthorId",
                table: "Destinations");

            migrationBuilder.DropForeignKey(
                name: "FK_TourPackages_AspNetUsers_AuthorId",
                table: "TourPackages");

            migrationBuilder.DropIndex(
                name: "IX_TourPackages_AuthorId",
                table: "TourPackages");

            migrationBuilder.DropIndex(
                name: "IX_Destinations_AuthorId",
                table: "Destinations");

            migrationBuilder.DropColumn(
                name: "AuthorId",
                table: "TourPackages");

            migrationBuilder.DropColumn(
                name: "AuthorId",
                table: "Destinations");
        }
    }
}
