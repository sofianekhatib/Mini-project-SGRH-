using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelManager.Domain.Enums;
using HotelManager.Infrastructure.Data;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System;

namespace HotelManager.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    [ApiExplorerSettings(IgnoreApi = true)] 
    public class ClientDashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ClientDashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var clientIdClaim = User.FindFirst("clientId")?.Value;
            if (!int.TryParse(clientIdClaim, out int clientId))
                return Unauthorized("Client ID not found in token");

            var today = DateTime.Today;
            var activeReservations = await _context.Reservations
                .CountAsync(r => r.ClientId == clientId && r.Statut == StatutReservation.Confirmee && r.DateFin >= today);
            var pastReservations = await _context.Reservations
                .CountAsync(r => r.ClientId == clientId && r.DateFin < today);

            return Ok(new { activeReservations, pastReservations, loyaltyPoints = 850, notifications = 0 });
        }
    }
}