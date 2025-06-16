using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace Backend.Models.Entities
{
    public class DiaryEntry
    {
        [BsonId]
        public ObjectId Id { get; set; }
        public string? userName { get; set; }
        public string? content { get; set; }
        public string? mood { get; set; }
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime? date { get; set; }
    }
}
