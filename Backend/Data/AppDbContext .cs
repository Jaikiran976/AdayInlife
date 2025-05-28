using Backend.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }


        public DbSet<SignUp> users => Set<SignUp>();
        public DbSet<DiaryEntry> diaryEntries => Set<DiaryEntry>();

        //for mongoDB comment out if used with sql
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<SignUp>();
            modelBuilder.Entity<DiaryEntry>();
        }
    }
}
