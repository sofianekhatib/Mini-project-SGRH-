using HotelManager.Application.DTOs;
using HotelManager.Application.Interfaces;
using HotelManager.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace HotelManager.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class FactureController : ControllerBase
    {
        private readonly IFactureService _factureService;
        private readonly AppDbContext _context;

        public FactureController(IFactureService factureService, AppDbContext context)
        {
            _factureService = factureService;
            _context = context;
        }
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllFactures()
        {
            var factures = await _context.Factures
                .Include(f => f.Reservation)
                    .ThenInclude(r => r.Client)
                .Include(f => f.Reservation.Chambre)
                .Select(f => new
                {
                    f.Id,
                    f.MontantTotal,
                    f.DateEmission,
                    f.EstPayee,
                    ReservationId = f.ReservationId,
                    ClientName = f.Reservation != null && f.Reservation.Client != null
                        ? f.Reservation.Client.Prenom + " " + f.Reservation.Client.Nom
                        : null,
                    ChambreNumero = f.Reservation != null && f.Reservation.Chambre != null
                        ? f.Reservation.Chambre.Numero
                        : null
                })
                .ToListAsync();
            return Ok(factures);
        }

        [HttpGet("reservation/{reservationId}")]
        public async Task<IActionResult> GetByReservation(int reservationId)
        {
            var facture = await _factureService.GetFactureByReservationIdAsync(reservationId);
            if (facture == null) return NotFound();
            return Ok(facture);
        }

        [HttpPost("{factureId}/pay")]
        public async Task<IActionResult> Pay(int factureId, PaiementDto paiement)
        {
            var result = await _factureService.PayerFactureAsync(factureId, paiement);
            if (!result) return BadRequest("Facture introuvable");
            return Ok("Paiement enregistré");
        }
    }
}