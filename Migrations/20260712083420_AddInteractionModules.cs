using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Celestia.Migrations
{
    /// <inheritdoc />
    public partial class AddInteractionModules : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PageViews_Destinations_DestinationId",
                table: "PageViews");

            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Destinations_DestinationId",
                table: "Reviews");

            migrationBuilder.AlterColumn<int>(
                name: "DestinationId",
                table: "Reviews",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<bool>(
                name: "IsApproved",
                table: "Reviews",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "LocalServiceId",
                table: "Reviews",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ReportCount",
                table: "Reviews",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TourPackageId",
                table: "Reviews",
                type: "integer",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "DestinationId",
                table: "PageViews",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<int>(
                name: "ArticleId",
                table: "PageViews",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LocalServiceId",
                table: "PageViews",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TourPackageId",
                table: "PageViews",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsApproved",
                table: "Comments",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ReportCount",
                table: "Comments",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_LocalServiceId",
                table: "Reviews",
                column: "LocalServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_TourPackageId",
                table: "Reviews",
                column: "TourPackageId");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_UserId",
                table: "Reviews",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_PageViews_ArticleId",
                table: "PageViews",
                column: "ArticleId");

            migrationBuilder.CreateIndex(
                name: "IX_PageViews_LocalServiceId",
                table: "PageViews",
                column: "LocalServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_PageViews_TourPackageId",
                table: "PageViews",
                column: "TourPackageId");

            migrationBuilder.AddForeignKey(
                name: "FK_PageViews_Articles_ArticleId",
                table: "PageViews",
                column: "ArticleId",
                principalTable: "Articles",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PageViews_Destinations_DestinationId",
                table: "PageViews",
                column: "DestinationId",
                principalTable: "Destinations",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PageViews_LocalServices_LocalServiceId",
                table: "PageViews",
                column: "LocalServiceId",
                principalTable: "LocalServices",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PageViews_TourPackages_TourPackageId",
                table: "PageViews",
                column: "TourPackageId",
                principalTable: "TourPackages",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_AspNetUsers_UserId",
                table: "Reviews",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Destinations_DestinationId",
                table: "Reviews",
                column: "DestinationId",
                principalTable: "Destinations",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_LocalServices_LocalServiceId",
                table: "Reviews",
                column: "LocalServiceId",
                principalTable: "LocalServices",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_TourPackages_TourPackageId",
                table: "Reviews",
                column: "TourPackageId",
                principalTable: "TourPackages",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PageViews_Articles_ArticleId",
                table: "PageViews");

            migrationBuilder.DropForeignKey(
                name: "FK_PageViews_Destinations_DestinationId",
                table: "PageViews");

            migrationBuilder.DropForeignKey(
                name: "FK_PageViews_LocalServices_LocalServiceId",
                table: "PageViews");

            migrationBuilder.DropForeignKey(
                name: "FK_PageViews_TourPackages_TourPackageId",
                table: "PageViews");

            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_AspNetUsers_UserId",
                table: "Reviews");

            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Destinations_DestinationId",
                table: "Reviews");

            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_LocalServices_LocalServiceId",
                table: "Reviews");

            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_TourPackages_TourPackageId",
                table: "Reviews");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_LocalServiceId",
                table: "Reviews");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_TourPackageId",
                table: "Reviews");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_UserId",
                table: "Reviews");

            migrationBuilder.DropIndex(
                name: "IX_PageViews_ArticleId",
                table: "PageViews");

            migrationBuilder.DropIndex(
                name: "IX_PageViews_LocalServiceId",
                table: "PageViews");

            migrationBuilder.DropIndex(
                name: "IX_PageViews_TourPackageId",
                table: "PageViews");

            migrationBuilder.DropColumn(
                name: "IsApproved",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "LocalServiceId",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "ReportCount",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "TourPackageId",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "ArticleId",
                table: "PageViews");

            migrationBuilder.DropColumn(
                name: "LocalServiceId",
                table: "PageViews");

            migrationBuilder.DropColumn(
                name: "TourPackageId",
                table: "PageViews");

            migrationBuilder.DropColumn(
                name: "IsApproved",
                table: "Comments");

            migrationBuilder.DropColumn(
                name: "ReportCount",
                table: "Comments");

            migrationBuilder.AlterColumn<int>(
                name: "DestinationId",
                table: "Reviews",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "DestinationId",
                table: "PageViews",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_PageViews_Destinations_DestinationId",
                table: "PageViews",
                column: "DestinationId",
                principalTable: "Destinations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Destinations_DestinationId",
                table: "Reviews",
                column: "DestinationId",
                principalTable: "Destinations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
