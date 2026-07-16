using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Celestia.Migrations
{
    /// <inheritdoc />
    public partial class AddLocalServiceIsActive : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_TourPackages_TourPackageId",
                table: "Bookings");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "LocalServices",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                table: "LocalServices",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AlterColumn<int>(
                name: "TourPackageId",
                table: "Bookings",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<int>(
                name: "LocalServiceId",
                table: "Bookings",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_LocalServiceId",
                table: "Bookings",
                column: "LocalServiceId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_LocalServices_LocalServiceId",
                table: "Bookings",
                column: "LocalServiceId",
                principalTable: "LocalServices",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_TourPackages_TourPackageId",
                table: "Bookings",
                column: "TourPackageId",
                principalTable: "TourPackages",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_LocalServices_LocalServiceId",
                table: "Bookings");

            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_TourPackages_TourPackageId",
                table: "Bookings");

            migrationBuilder.DropIndex(
                name: "IX_Bookings_LocalServiceId",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "LocalServices");

            migrationBuilder.DropColumn(
                name: "Price",
                table: "LocalServices");

            migrationBuilder.DropColumn(
                name: "LocalServiceId",
                table: "Bookings");

            migrationBuilder.AlterColumn<int>(
                name: "TourPackageId",
                table: "Bookings",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_TourPackages_TourPackageId",
                table: "Bookings",
                column: "TourPackageId",
                principalTable: "TourPackages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
