using HotelManager.Infrastructure.Data;
using HotelManager.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace HotelManager.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ContactController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Post(Contact contact)
        {
            if (contact == null)
                return BadRequest();

            await _context.Contacts.AddAsync(contact);
            await _context.SaveChangesAsync();

            return Ok(contact);
        }
    }
}