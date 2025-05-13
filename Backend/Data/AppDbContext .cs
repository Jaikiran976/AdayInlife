using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Backend.Data
{
    public class AppDbContext /*: DbContext*/
    {
        // public DbSet<SignUp> Users { get; init; }

        // public AppDbContext(DbContextOptions<AppDbContext> options)
        //     : base(options) { }


        //// public DbSet<SignUp> Users => Set<SignUp>();

        // //for mongoDB
        // protected override void OnModelCreating(ModelBuilder modelBuilder)
        // {
        //     base.OnModelCreating(modelBuilder);

        //     modelBuilder.Entity<SignUp>();
        // }
        private readonly IMongoDatabase _database;

        public AppDbContext(IOptions<MongoDbSettings> settings)
        {
            try
            {
                var client = new MongoClient(settings.Value.AtlasURI);
                _database = client.GetDatabase(settings.Value.DatabaseName);

                // Test connection by pinging the server
                var command = new BsonDocument("ping", 1);
                _database.RunCommand<BsonDocument>(command);
            }
            catch (Exception ex)
            {
                throw;
            }
        }


        //public IMongoCollection<SignUp> SignUps => _database.GetCollection<SignUp>("users");
        public IMongoCollection<SignUp> SignUps
        {
            get
            {
                try
                {
                    // Try getting the collection
                    var collection = _database.GetCollection<SignUp>("users");

                    // Optionally, you can check the count of documents in the collection to verify it exists
                    var count = collection.CountDocuments(new BsonDocument());

                    return collection;
                }
                catch (Exception ex)
                {
                    // Log the full exception stack trace
                    Console.WriteLine($"Error getting collection: {ex.Message}");
                    Console.WriteLine($"Stack trace: {ex.StackTrace}");
                    throw;  // Re-throw the exception after logging it
                }
            }
        }


    }
}
