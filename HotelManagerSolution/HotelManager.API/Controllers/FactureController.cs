using System.Threading.Tasks;
using HotelManager.Application.DTOs;
using HotelManager.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelManager.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class FactureController : ControllerBase
    {
        private readonly IFactureService _factureService;

        public FactureController(IFactureService factureService)
        {
            _factureService = factureService;
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