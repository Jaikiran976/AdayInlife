
namespace Backend.Models.Dtos
{
    public class DiaryEntryDto
    {
        public string? token { get; set; }
        public string? content { get; set; }
        public string? mood { get; set; }
        public DateTime? date { get; set; }
    }
}
