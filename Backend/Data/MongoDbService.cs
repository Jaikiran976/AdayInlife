using Backend.Models;
using MongoDB.Driver;

namespace Backend.Data
{
    public class MongoDbService
    {
        private readonly IConfiguration _configuration;
        private readonly IMongoDatabase? _database;

        public MongoDbService(IConfiguration configuration)
        {
            _configuration = configuration;

            //var connectionString = _configuration.GetConnectionString("MongoDb");
            var connectionString = _configuration.GetSection("MongoDbSettings").Get<MongoDbSettings>().AtlasURI;
            var mongoUrl = MongoUrl.Create(connectionString);
            var mongoClient = new MongoClient(mongoUrl);
            _database = mongoClient.GetDatabase(_configuration.GetSection("MongoDbSettings").Get<MongoDbSettings>().DatabaseName);
        }

        public IMongoDatabase? Database => _database;
    }
}
