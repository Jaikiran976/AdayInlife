using Backend.Data;
using Backend.Helpers;
using Backend.Models.Dtos;
using Backend.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DiaryEntriesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DiaryEntriesController(AppDbContext context)
        {
            _context = context;
        }

        //Add Entry for existing user
        [HttpPost("AddEntry")]
        public async Task<IActionResult> Create([FromBody] DiaryEntryDto entryDto)
        {
            if(entryDto.token ==  null)
                return NotFound(new { message = "User does not exist in database." });

            var username = JwtTokenHelper.GetUsername(entryDto.token);

            var user = await _context.users.FirstOrDefaultAsync(u => u.userName == username);

            if (user == null)
            {
                return NotFound(new { message = "User does not exist in database." });
            }

            //add new diary entry
            DiaryEntry addEntry = new DiaryEntry();

            addEntry.userName = user.userName;
            addEntry.content = entryDto.content;
            addEntry.mood = entryDto.mood;
            addEntry.date = entryDto.date;

            _context.diaryEntries.Add(addEntry);
            _context.SaveChanges();

            user.password = "";

            // New entry is added
            return Ok(new
            {
                message = "New entry is added."
            });
        }

        //get all entries
        [HttpGet("GetAllEntries")]
        public async Task<IActionResult> GetAllEntries([FromQuery] string token)
        {
            if (token == null)
                return NotFound(new { message = "User does not exist in database." });

            var username = JwtTokenHelper.GetUsername(token);

            var user = await _context.users.FirstOrDefaultAsync(u => u.userName == username);

            if (user == null)
            {
                return NotFound(new { message = "User does not exist in database." });
            }

            var entries = await _context.diaryEntries.Where(e => e.userName == username).ToListAsync();
            return Ok(entries);
        }
    }
}
