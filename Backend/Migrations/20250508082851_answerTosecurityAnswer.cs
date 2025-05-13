using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class answerTosecurityAnswer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Question",
                table: "Users",
                newName: "securityQuestion");

            migrationBuilder.RenameColumn(
                name: "Answer",
                table: "Users",
                newName: "securityAnswer");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "securityQuestion",
                table: "Users",
                newName: "Question");

            migrationBuilder.RenameColumn(
                name: "securityAnswer",
                table: "Users",
                newName: "Answer");
        }
    }
}
