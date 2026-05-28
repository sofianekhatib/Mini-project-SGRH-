using HotelManager.Application.DTOs;
using HotelManager.Application.Interfaces;
using HotelManager.Domain.Entities;
using HotelManager.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Claims;
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

        [Authorize(Roles = "Admin,Receptionniste")]
        [HttpGet("reservation/{reservationId}")]
        public async Task<IActionResult> GetByReservation(int reservationId)
        {
            var facture = await _factureService.GetFactureByReservationIdAsync(reservationId);
            if (facture == null) return NotFound();
            return Ok(facture);
        }

        [Authorize(Roles = "Admin,Receptionniste")]
        [HttpGet("client/{clientId}")]
        public async Task<IActionResult> GetByClientId(int clientId)
        {
            var factures = await _context.Factures
                .Include(f => f.Reservation)
                .Where(f => f.Reservation.ClientId == clientId)
                .ToListAsync();
            return Ok(factures);
        }

        [Authorize(Roles = "Admin,Receptionniste")]
        [HttpPost("reservation/{reservationId}")]
        public async Task<IActionResult> GenerateForReservation(int reservationId)
        {
            var reservation = await _context.Reservations
                .Include(r => r.Facture)
                .FirstOrDefaultAsync(r => r.Id == reservationId);
            if (reservation == null) return NotFound("Réservation introuvable");
            if (reservation.Facture != null)
                return BadRequest("Une facture existe déjà pour cette réservation");

            var chambre = await _context.Chambres.FindAsync(reservation.ChambreId);
            if (chambre == null) return NotFound("Chambre introuvable");

            var nbNuits = (reservation.DateFin - reservation.DateDebut).Days;
            var montant = nbNuits * chambre.PrixParNuit;
            var facture = new Facture
            {
                ReservationId = reservation.Id,
                MontantTotal = montant,
                DateEmission = System.DateTime.Now,
                EstPayee = false
            };
            await _context.Factures.AddAsync(facture);
            await _context.SaveChangesAsync();

            return Ok(new { facture.Id, facture.MontantTotal, facture.DateEmission });
        }

        [Authorize(Roles = "Admin,Receptionniste")]
        [HttpPost("{factureId}/pay")]
        public async Task<IActionResult> Pay(int factureId, PaiementDto paiement)
        {
            var result = await _factureService.PayerFactureAsync(factureId, paiement);
            if (!result) return BadRequest("Facture introuvable");
            return Ok("Paiement enregistré");
        }

        [Authorize] 
        [HttpGet("my-factures")]
        public async Task<IActionResult> GetMyFactures()
        {
            var clientIdClaim = User.FindFirst("clientId")?.Value;
            if (!int.TryParse(clientIdClaim, out int clientId))
                return Unauthorized("Client ID not found in token");

            var factures = await _context.Factures
                .Include(f => f.Reservation)
                .Where(f => f.Reservation.ClientId == clientId)
                .Select(f => new { f.Id, f.MontantTotal, f.DateEmission, f.EstPayee, f.ReservationId })
                .ToListAsync();
            return Ok(factures);
        }
    }
}