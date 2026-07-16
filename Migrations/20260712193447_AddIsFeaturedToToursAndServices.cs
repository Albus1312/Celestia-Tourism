using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Celestia.Migrations
{
    /// <inheritdoc />
    public partial class AddIsFeaturedToToursAndServices : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsFeatured",
                table: "TourPackages",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsFeatured",
                table: "LocalServices",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsFeatured",
                table: "TourPackages");

            migrationBuilder.DropColumn(
                name: "IsFeatured",
                table: "LocalServices");
        }
    }
}
