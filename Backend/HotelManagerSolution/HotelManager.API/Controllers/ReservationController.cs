using HotelManager.Application.DTOs;
using HotelManager.Application.Interfaces;
using HotelManager.Domain.Entities;
using HotelManager.Domain.Enums;
using HotelManager.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace HotelManager.API.Controllers
{
    [Authorize] 
    [ApiController]
    [Route("api/[controller]")]
    public class ReservationController : ControllerBase
    {
        private readonly IReservationService _reservationService;
        private readonly AppDbContext _context; 
        public ReservationController(IReservationService reservationService, AppDbContext context)
        {
            _reservationService = reservationService;
            _context = context;
        }

        [Authorize(Roles = "Admin,Receptionniste")]
        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(await _reservationService.GetAllReservationsAsync());

        [HttpGet("client/{clientId}")]
        public async Task<IActionResult> GetByClientId(int clientId) =>
            Ok(await _reservationService.GetReservationsByClientAsync(clientId));

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var res = await _reservationService.GetReservationByIdAsync(id);
            if (res == null) return NotFound();
            return Ok(res);
        }

        [Authorize(Roles = "Admin,Receptionniste,Client")]
        [HttpPost]
        public async Task<IActionResult> Create(CreateReservationDto dto)
        {
            var created = await _reservationService.CreateReservationAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [Authorize(Roles = "Admin,Receptionniste,Client")]
        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> Cancel(int id)
        {
            await _reservationService.CancelReservationAsync(id);
            return NoContent();
        }

        [Authorize(Roles = "Admin,Receptionniste")]
        [HttpGet("confirmations")]
        public async Task<IActionResult> GetConfirmations()
        {
            var today = DateTime.Today;
            var reservations = await _context.Reservations
                .Include(r => r.Client)
                .Include(r => r.Chambre)
                .Where(r => r.Statut == StatutReservation.Confirmee && r.DateDebut <= today)
                .Select(r => new
                {
                    r.Id,
                    r.DateDebut,
                    r.DateFin,
                    Client = new { r.Client.Id, r.Client.Nom, r.Client.Prenom },
                    Chambre = new { r.Chambre.Id, r.Chambre.Numero, r.Chambre.Type }
                })
                .ToListAsync();
            return Ok(reservations);
        }

        [Authorize(Roles = "Admin,Receptionniste")]
        [HttpGet("active")]
        public async Task<IActionResult> GetActive()
        {
            var reservations = await _context.Reservations
                .Include(r => r.Client)
                .Include(r => r.Chambre)
                .Where(r => r.Statut == StatutReservation.EnCours)
                .Select(r => new
                {
                    r.Id,
                    r.DateDebut,
                    r.DateFin,
                    Client = new { r.Client.Id, r.Client.Nom, r.Client.Prenom },
                    Chambre = new { r.Chambre.Id, r.Chambre.Numero, r.Chambre.Type }
                })
                .ToListAsync();
            return Ok(reservations);
        }

        [Authorize(Roles = "Admin,Receptionniste")]
        [HttpPost("{id}/checkin")]
        public async Task<IActionResult> CheckIn(int id)
        {
            var reservation = await _context.Reservations.FindAsync(id);
            if (reservation == null) return NotFound();
            if (reservation.Statut != StatutReservation.Confirmee)
                return BadRequest("La réservation n'est pas confirmée");
            if (reservation.DateDebut > DateTime.Today)
                return BadRequest("La date d'arrivée n'est pas encore atteinte");

            var chambre = await _context.Chambres.FindAsync(reservation.ChambreId);
            if (chambre == null) return NotFound();

            reservation.Statut = StatutReservation.EnCours; 
            chambre.Statut = StatutChambre.Occupee;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [Authorize(Roles = "Admin,Receptionniste")]
        [HttpPost("{id}/checkout")]
        public async Task<IActionResult> CheckOut(int id)
        {
            var reservation = await _context.Reservations
                .Include(r => r.Facture)
                .FirstOrDefaultAsync(r => r.Id == id);
            if (reservation == null) return NotFound();
            if (reservation.Statut != StatutReservation.EnCours)
                return BadRequest("La réservation n'est pas en cours");

            var chambre = await _context.Chambres.FindAsync(reservation.ChambreId);
            if (chambre != null)
                chambre.Statut = StatutChambre.Disponible;

            reservation.Statut = StatutReservation.Terminee;

            if (reservation.Facture == null)
            {
                var nbNuits = (reservation.DateFin - reservation.DateDebut).Days;
                var montant = nbNuits * (chambre?.PrixParNuit ?? 0);
                var facture = new Facture
                {
                    ReservationId = reservation.Id,
                    MontantTotal = montant,
                    DateEmission = DateTime.Now,
                    EstPayee = false
                };
                await _context.Factures.AddAsync(facture);
            }
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}