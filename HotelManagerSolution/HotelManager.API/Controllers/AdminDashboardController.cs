using HotelManager.Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelManager.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminDashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminDashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats/totals")]
        public async Task<IActionResult> GetTotals()
        {
            var totalChambres = await _context.Chambres.CountAsync();
            var totalClients = await _context.Clients.CountAsync();
            var totalReservations = await _context.Reservations.CountAsync();
            var totalRevenus = await _context.Factures.Where(f => f.EstPayee).SumAsync(f => f.MontantTotal);

            return Ok(new
            {
                totalChambres,
                totalClients,
                totalReservations,
                totalRevenus
            });
        }
    }
}